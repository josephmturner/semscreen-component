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
import {
  createReferenceTo,
  getMessageById,
  getPointById,
  getReferencedPointId,
} from "../dataModels/pointUtils";

export interface DraftPointCreateParams {
  point: PointNoIdI;
  index: number;
  main?: boolean;
}

export interface _DraftPointCreateParams extends DraftPointCreateParams {
  newPointId: string;
}

export const draftPointCreate = (
  params: DraftPointCreateParams
): Action<_DraftPointCreateParams> => {
  const newPointId = uuidv4();
  return {
    type: Actions.draftPointCreate,
    params: {
      ...params,
      newPointId,
    },
  };
};

export interface DraftPointUpdateParams {
  point: PointI;
}

export const draftPointUpdate = (
  params: DraftPointUpdateParams
): Action<DraftPointUpdateParams> => {
  return {
    type: Actions.draftPointUpdate,
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

  const currentMessageId = appState.semanticScreen.currentMessage as string;
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

export interface DraftPointsDeleteParams {
  pointIds: string[];
  deleteSelectedPoints?: boolean;
}

export const draftPointsDelete = (
  params: DraftPointsDeleteParams
): Action<DraftPointsDeleteParams> => {
  return {
    type: Actions.draftPointsDelete,
    params,
  };
};

export interface CombinePointsParams {
  shape: PointShape;
  keepIndex: number;
  deleteIndex: number;
}

export interface _CombinePointsParams extends CombinePointsParams {
  pointToKeepId: string;
  pointToKeep: PointI;
  pointToDeleteId: string;
  currentMessageId: string;
}

export const _combinePoints = (
  params: _CombinePointsParams
): Action<_CombinePointsParams> => {
  return {
    type: Actions.combinePoints,
    params,
  };
};

export const combinePoints = (
  params: CombinePointsParams
): ThunkAction<void, AppState, unknown, Action<_CombinePointsParams>> => {
  return (dispatch, getState) => {
    const state = getState();
    const { shape, keepIndex, deleteIndex } = params;
    const currentMessageId = state.semanticScreen.currentMessage as string;
    const currentMessage = state.draftMessages.byId[currentMessageId];

    const withinBounds = (index: number): boolean => {
      return index >= 0 && index < currentMessage.shapes[shape].length;
    };

    const isQuoted = (index: number): boolean => {
      const pointId = currentMessage.shapes[shape][index];
      return !!getReferencedPointId(pointId, state);
    };

    if (
      // Only combine points with points that exist
      (!withinBounds(keepIndex) && !withinBounds(deleteIndex)) ||
      // Only combine points with non-quoted points
      (isQuoted(keepIndex) && isQuoted(deleteIndex))
    ) {
      return;
    }

    const pointToKeepId = currentMessage.shapes[shape][keepIndex];
    const pointToKeep = getPointById(pointToKeepId, state) as PointI;
    const pointToDeleteId = currentMessage.shapes[shape][deleteIndex];

    dispatch(
      _combinePoints({
        pointToKeepId,
        pointToKeep,
        pointToDeleteId,
        currentMessageId,
        ...params,
      })
    );
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
