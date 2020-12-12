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
import { Action, Actions } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { ThunkAction } from "redux-thunk";

import { AppState } from "../reducers/store";
import {
  PointI,
  PointReferenceI,
  PointShape,
  PointNoIdI,
} from "../dataModels/dataModels";
import { createReferenceTo, getMessageById } from "../dataModels/pointUtils";

export interface PointCreateParams {
  point: PointNoIdI;
  index: number;
  main?: boolean;
}

export interface _PointCreateParams extends PointCreateParams {
  newPointId: string;
}

export const pointCreate = (
  params: PointCreateParams
): Action<_PointCreateParams> => {
  const newPointId = uuidv4();
  return {
    type: Actions.pointCreate,
    params: {
      ...params,
      newPointId,
    },
  };
};

export interface PointUpdateParams {
  point: PointI;
}

export const pointUpdate = (
  params: PointUpdateParams
): Action<PointUpdateParams> => {
  return {
    type: Actions.pointUpdate,
    params,
  };
};

export interface PointsMoveWithinMessageParams {}

export const pointsMoveWithinMessage = (
  params: PointsMoveWithinMessageParams
): Action<PointsMoveWithinMessageParams> => {
  return {
    type: Actions.pointsMoveWithinMessage,
    params,
  };
};

function _shouldCopy(
  params: PointsMoveToMessageParams,
  appState: AppState
): boolean {
  if (params.messageId === undefined) {
    return false;
  }

  const currentMessageId = appState.semanticScreen.currentMessage;
  const message = getMessageById(currentMessageId, appState);

  if (appState.draftMessages.allIds.includes(message._id)) {
    return false;
  }

  return true;
}

export interface PointsMoveToMessageParams {
  messageId: string;
}

export const pointsMoveToMessage = (
  params: PointsMoveToMessageParams
): ThunkAction<void, AppState, unknown, Action<_PointsMoveToMessageParams>> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();

    let newReferencePoints: PointReferenceI[] | undefined;

    if (_shouldCopy(params, appState)) {
      newReferencePoints = appState.selectedPoints.pointIds.map((pointId) => {
        return createReferenceTo(pointId, appState);
      });
    }

    dispatch(
      _pointsMoveToMessage({
        messageId: params.messageId,
        newReferencePoints,
      })
    );
  };
};

export interface _PointsMoveToMessageParams {
  messageId: string;
  newReferencePoints?: PointReferenceI[];
}

export const _pointsMoveToMessage = (
  params: _PointsMoveToMessageParams
): Action<_PointsMoveToMessageParams> => {
  return {
    type: Actions.pointsMoveToMessage,
    params,
  };
};

export interface PointsDeleteParams {
  pointIds: string[];
  deleteSelectedPoints?: boolean;
}

export const pointsDelete = (
  params: PointsDeleteParams
): Action<PointsDeleteParams> => {
  return {
    type: Actions.pointsDelete,
    params,
  };
};

export interface CombinePointsParams {
  shape: PointShape;
  keepIndex: number;
  deleteIndex: number;
}

export const combinePoints = (
  params: CombinePointsParams
): Action<CombinePointsParams> => {
  return {
    type: Actions.combinePoints,
    params,
  };
};

export interface SplitIntoTwoPointsParams {
  pointId: string;
  sliceIndex: number;
}

export interface _SplitIntoTwoPointsParams extends SplitIntoTwoPointsParams {
  newPointId: string;
}

export const splitIntoTwoPoints = (
  params: SplitIntoTwoPointsParams
): Action<_SplitIntoTwoPointsParams> => {
  const newPointId = uuidv4();
  return {
    type: Actions.splitIntoTwoPoints,
    params: {
      ...params,
      newPointId,
    },
  };
};
