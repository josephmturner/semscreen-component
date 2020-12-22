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
import { PointI, PointShape, PointReferenceI } from "../dataModels/dataModels";
import { createReferenceTo } from "../dataModels/pointUtils";
import { AppState } from "../reducers/store";

export interface MessageCreateParams {}

export interface _MessageCreateParams extends MessageCreateParams {
  newMessageId: string;
  newReferencePoints?: PointReferenceI[];
}

function _shouldCopy(appState: AppState): boolean {
  const currentMessageId = appState.semanticScreen.currentMessage;
  return (
    currentMessageId !== undefined &&
    appState.messages.allIds.includes(currentMessageId)
  );
}

export const messageCreate = (
  params: MessageCreateParams
): ThunkAction<void, AppState, unknown, Action<_MessageCreateParams>> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();

    //Create newReferencePoints if the current message is a published message
    //Cut and paste draft points by leaving newReferencePoints undefined
    let newReferencePoints: PointReferenceI[] | undefined;
    if (_shouldCopy(appState)) {
      newReferencePoints = appState.selectedPoints.pointIds.map((pointId) => {
        return createReferenceTo(pointId, appState);
      });
    }

    const newMessageId = uuidv4();

    dispatch(
      _messageCreate({
        newMessageId,
        newReferencePoints,
      })
    );
  };
};

const _messageCreate = (
  params: _MessageCreateParams
): Action<_MessageCreateParams> => {
  return {
    type: Actions.messageCreate,
    params,
  };
};

export interface MessageDeleteParams {
  messageId: string;
}

export const messageDelete = (
  params: MessageDeleteParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<MessageDeleteParams | _MessageCreateParams>
> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();
    const remainingDraftMessages = appState.draftMessages.allIds.filter(
      (id) => id !== params.messageId
    );

    // If the message to be deleted is the current message and there are no more draft messages, make a new one:
    if (
      remainingDraftMessages[0] === undefined &&
      appState.semanticScreen.currentMessage === params.messageId
    ) {
      const newMessageId = uuidv4();
      dispatch(
        _messageCreate({
          newMessageId,
        })
      );
    }

    dispatch({ type: Actions.messageDelete, params });
  };
};

export interface SetMainParams {
  pointId?: string;
}

export const setMain = (params: SetMainParams): Action<SetMainParams> => {
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
