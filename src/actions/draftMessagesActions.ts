/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ThunkAction } from "redux-thunk";
import { v4 as uuidv4 } from "uuid";

import { Action, Actions } from "./constants";
import { PointI, PointShape } from "../dataModels/dataModels";
import { containsPoints, getPointIfReference } from "../dataModels/pointUtils";
import { AppState } from "../reducers";
import {
  pointsMoveToMessage,
  PointsMoveToMessageParams,
  _draftPointsDelete,
} from "./draftPointsActions";
import {
  _setCurrentMessage,
  SetCurrentMessageParams,
} from "./semanticScreenActions";

export interface _DraftMessageCreateParams {
  newMessageId: string;
}

export const draftMessageCreate = (): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_DraftMessageCreateParams | PointsMoveToMessageParams>
> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();

    //Prevent creation of many empty messages...

    const oldMessageId = appState.semanticScreen.currentMessage as string;
    if (!containsPoints(oldMessageId, appState)) {
      return;
    }

    // Create the new message...
    const newMessageId = uuidv4();

    dispatch(
      _draftMessageCreate({
        newMessageId,
      })
    );

    // If there are points selected, add them to the new message
    if (appState.selectedPoints.pointIds) {
      dispatch(
        pointsMoveToMessage({
          newMessageId,
          oldMessageId,
        })
      );
    }
  };
};

export const _draftMessageCreate = (
  params: _DraftMessageCreateParams
): Action<_DraftMessageCreateParams> => {
  return {
    type: Actions.draftMessageCreate,
    params,
  };
};

export interface DraftMessageDeleteParams {
  messageId: string;
}

export const draftMessageDelete = (
  params: DraftMessageDeleteParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<
    | DraftMessageDeleteParams
    | _DraftMessageCreateParams
    | SetCurrentMessageParams
  >
> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();
    const remainingDraftMessages = appState.draftMessages.allIds.filter(
      (id) => id !== params.messageId
    );

    //If we're deleting the current message, we must set the current message
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    if (currentMessageId === params.messageId) {
      //Set it to the next draft message...
      if (remainingDraftMessages[0] !== undefined) {
        const nextDraftId = remainingDraftMessages[0];

        dispatch(_setCurrentMessage({ messageId: nextDraftId }));
      } else {
        //If no more drafts exists, create a new one
        const newMessageId = uuidv4();

        dispatch(
          _draftMessageCreate({
            newMessageId,
          })
        );
      }
    }

    dispatch(
      _draftMessageAndPointsDelete({
        ...params,
      })
    );
  };
};

export const _draftMessageAndPointsDelete = (
  params: DraftMessageDeleteParams
): ThunkAction<void, AppState, unknown, Action<DraftMessageDeleteParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    const { messageId } = params;
    const messageToDelete = appState.draftMessages.byId[messageId];
    let pointIds = Object.values(messageToDelete.shapes).flat();
    if (messageToDelete.main !== undefined) {
      pointIds.push(messageToDelete.main);
    }

    dispatch(_draftPointsDelete({ pointIds, messageId }));
    dispatch(_draftMessageDelete(params));
  };
};

export const _draftMessageDelete = (
  params: DraftMessageDeleteParams
): Action<DraftMessageDeleteParams> => {
  return {
    type: Actions.draftMessageDelete,
    params,
  };
};

export interface SetMainParams {
  newMainId?: string;
}

export const setMain = (
  params: SetMainParams
): ThunkAction<void, AppState, unknown, Action<_SetMainParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    const currentMessageId = appState.semanticScreen.currentMessage as string;

    let { newMainId } = params;
    if (newMainId === undefined) {
      newMainId = appState.selectedPoints.pointIds[0];
    }
    const oldMainId: string | undefined =
      appState.draftMessages.byId[currentMessageId].main;

    if (newMainId === oldMainId) {
      return;
    }

    const newMainShape = getPointIfReference(newMainId, appState).shape;
    let oldMainShape: PointShape | undefined;
    if (oldMainId !== undefined) {
      oldMainShape = getPointIfReference(oldMainId, appState).shape;
    }

    dispatch(
      _setMain({
        currentMessageId,
        newMainId,
        newMainShape,
        oldMainId,
        oldMainShape,
      })
    );
  };
};

export interface _SetMainParams extends Required<SetMainParams> {
  currentMessageId: string;
  newMainShape: PointShape;
  oldMainId?: string;
  oldMainShape?: PointShape;
}

export const _setMain = (params: _SetMainParams): Action<_SetMainParams> => {
  return {
    type: Actions.setMain,
    params,
  };
};

export interface SplitIntoTwoPointsParams {
  topPoint: PointI;
  bottomPoint: PointI;
  shape: PointShape;
  index: number;
  newPointId: string;
}

export const splitIntoTwoPoints = (
  params: SplitIntoTwoPointsParams
): Action<SplitIntoTwoPointsParams> => {
  return {
    type: Actions.splitIntoTwoPoints,
    params,
  };
};
