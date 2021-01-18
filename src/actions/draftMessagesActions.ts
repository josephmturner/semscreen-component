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
import { History } from "history";

import { Action, Actions } from "./constants";
import { PointI, PointShape } from "../dataModels/dataModels";
import { containsPoints, getPointIfReference } from "../dataModels/pointUtils";
import { AppState } from "../reducers";
import {
  pointsMoveToMessage,
  PointsMoveToMessageParams,
} from "./draftPointsActions";

export interface DraftMessageCreateParams {
  oldMessageId: string;
  history: History;
}

export const draftMessageCreate = (
  params: DraftMessageCreateParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_DraftMessageCreateParams | PointsMoveToMessageParams>
> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();

    //Prevent creation of many empty messages...
    const { oldMessageId } = params;
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
    if (appState.selectedPoints.pointIds.length !== 0) {
      dispatch(
        pointsMoveToMessage({
          moveToMessageId: newMessageId,
          moveFromMessageId: oldMessageId,
          history: params.history,
        })
      );
    } else {
      const currentIdentity = appState.userIdentities.currentIdentity;
      params.history.push(`/u/${currentIdentity}/d/${newMessageId}`);
    }
  };
};

export interface _DraftMessageCreateParams {
  newMessageId: string;
}

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
  currentMessageId: string;
  history: History;
}

export const draftMessageDelete = (
  params: DraftMessageDeleteParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_DraftMessageDeleteParams | _DraftMessageCreateParams>
> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();
    const { messageId, currentMessageId } = params;
    const remainingDraftMessages = appState.draftMessages.allIds.filter(
      (id) => id !== messageId
    );

    //If we're deleting the current message, we must set the current message
    if (currentMessageId === messageId) {
      const currentIdentity = appState.userIdentities.currentIdentity;

      //Set it to the next draft message...
      if (remainingDraftMessages[0] !== undefined) {
        const nextDraftId = remainingDraftMessages[0];

        params.history.push(`/u/${currentIdentity}/d/${nextDraftId}`);
      } else {
        //If no more drafts exists, create a new one
        const newMessageId = uuidv4();

        dispatch(
          _draftMessageCreate({
            newMessageId,
          })
        );
        params.history.push(`/u/${currentIdentity}/d/${newMessageId}`);
      }
    }

    const messageToDelete = appState.draftMessages.byId[messageId];
    let pointIds = Object.values(messageToDelete.shapes).flat();
    if (messageToDelete.main !== undefined) {
      pointIds.push(messageToDelete.main);
    }

    dispatch(_draftMessageDelete({ pointIds, messageId }));
  };
};

export interface _DraftMessageDeleteParams {
  messageId: string;
  pointIds: string[];
}

export const _draftMessageDelete = (
  params: _DraftMessageDeleteParams
): Action<_DraftMessageDeleteParams> => {
  return {
    type: Actions.draftMessageDelete,
    params,
  };
};

export interface SetMainParams {
  newMainId?: string;
  messageId: string;
}

export const setMain = (
  params: SetMainParams
): ThunkAction<void, AppState, unknown, Action<_SetMainParams>> => {
  return (dispatch, getState) => {
    const appState = getState();

    const { messageId } = params;
    let { newMainId } = params;
    if (newMainId === undefined) {
      newMainId = appState.selectedPoints.pointIds[0];
    }
    const oldMainId: string | undefined =
      appState.draftMessages.byId[messageId].main;

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
        messageId,
        newMainId,
        newMainShape,
        oldMainId,
        oldMainShape,
      })
    );
  };
};

export interface _SetMainParams extends Required<SetMainParams> {
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
