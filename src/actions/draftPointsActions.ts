/*
  Copyright (C) 2021 by USHIN, Inc.

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

import { History } from "history";
import { AppState } from "../reducers";
import {
  isPointShape,
  PointI,
  PointReferenceI,
  PointReferenceWithShape,
  PointShape,
  PointNoIdI,
} from "../dataModels/dataModels";
import {
  getMessageById,
  getOriginalShape,
  getPointById,
  getPointIfReference,
  getReferenceData,
  getReferencedPointId,
  isReference,
} from "../dataModels/pointUtils";

export interface DraftPointCreateParams {
  point: PointNoIdI;
  index: number;
  messageId: string;
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

export interface PointsMoveWithinMessageParams {
  messageId: string;
}

export const pointsMoveWithinMessage = (
  params: PointsMoveWithinMessageParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_PointsMoveWithinMessageParams>
> => {
  return (dispatch, getState) => {
    const appState = getState();

    if (appState.drag.context === null) return;

    const { region, index } = appState.drag.context;

    // Only move points when hovering over semantic screen regions
    if (!isPointShape(region)) return;

    // Don't move quoted points to regions with a different shape
    const selectedPointIds = appState.selectedPoints.pointIds;
    const pointsToMoveIds = selectedPointIds.filter(
      (p) =>
        !getReferenceData(p, appState) ||
        region === getPointIfReference(p, appState).shape
    );
    // Don't change the shape of any reference points
    const pointIdsExcludingReferencePoints = selectedPointIds.filter(
      (p) => !getReferenceData(p, appState)
    );

    dispatch(
      _pointsMoveWithinMessage({
        ...params,
        pointsToMoveIds,
        pointIdsExcludingReferencePoints,
        region,
        index,
      })
    );
  };
};

export interface _PointsMoveWithinMessageParams {
  messageId: string;
  pointsToMoveIds: string[];
  pointIdsExcludingReferencePoints: string[];
  region: PointShape;
  index: number;
}

export const _pointsMoveWithinMessage = (
  params: _PointsMoveWithinMessageParams
): Action<_PointsMoveWithinMessageParams> => {
  return {
    type: Actions.pointsMoveWithinMessage,
    params,
  };
};

function createReferenceTo(
  pointId: string,
  messageId: string,
  appState: AppState
): PointReferenceI {
  const point = getPointById(pointId, appState);
  const authorId = getMessageById(messageId, appState).author;
  const newPointId = uuidv4();

  const referenceHistory = isReference(point)
    ? [...point.referenceHistory]
    : [];
  referenceHistory.push({
    pointId,
    messageId,
    authorId,
  });

  return {
    _id: newPointId,
    referenceHistory,
  };
}

export interface PointsMoveToMessageParams {
  moveToMessageId: string;
  moveFromMessageId: string;
  history: History;
}

export const pointsMoveToMessage = (
  params: PointsMoveToMessageParams
): ThunkAction<void, AppState, unknown, Action<_PointsMoveToMessageParams>> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();
    const { moveToMessageId, moveFromMessageId, history } = params;

    //Don't move points to the same message
    if (moveFromMessageId === moveToMessageId) {
      return;
    }

    // Move points in draftMessageReducer
    let movePoints: (PointReferenceWithShape | PointI)[] = [];

    // Create these reference points in draftPointsReducer
    let newDraftPoints: PointReferenceI[] = [];

    // Remove points from original message?
    let cutFromMessageId: string | undefined;

    // If the old message is a draft, cut the selected points
    // from the old message and paste them into the new one
    if (appState.draftMessages.allIds.includes(moveFromMessageId)) {
      cutFromMessageId = moveFromMessageId;
      movePoints = appState.selectedPoints.pointIds.map((id) => {
        const point = getPointById(id, appState);

        // It is necessary to pass the shape along with each reference point
        // so the draftMessageReducer knows where in the shapes object to put it
        if (isReference(point)) {
          const shape = getOriginalShape(point, appState);
          return { ...point, shape };
        }

        return point;
      });
    } else {
      // If the old message is not a draft, create reference points
      // from the selected points (do not remove points from the original message)
      if (!appState.draftMessages.allIds.includes(moveFromMessageId)) {
        movePoints = appState.selectedPoints.pointIds.map((pointId) => {
          const point = createReferenceTo(pointId, moveFromMessageId, appState);
          newDraftPoints.push(point);
          const shape = getOriginalShape(point, appState);

          return { ...point, shape };
        });
      }
    }

    const currentIdentity = appState.userIdentities.currentIdentity;
    history.push(`/u/${currentIdentity}/d/${moveToMessageId}`);

    dispatch(
      _pointsMoveToMessage({
        moveToMessageId,
        movePoints,
        newDraftPoints,
        cutFromMessageId,
      })
    );
  };
};

export interface _PointsMoveToMessageParams {
  moveToMessageId: string;
  movePoints: (PointI | PointReferenceWithShape)[];
  newDraftPoints?: PointReferenceI[];
  cutFromMessageId?: string;
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
  messageId: string;
  deleteSelectedPoints: boolean;
}

export const draftPointsDelete = (
  params: DraftPointsDeleteParams
): ThunkAction<void, AppState, unknown, Action<_DraftPointsDeleteParams>> => {
  return (dispatch, getState) => {
    const appState = getState();

    let { pointIds, messageId, deleteSelectedPoints } = params;
    if (deleteSelectedPoints === true) {
      const selectedPointIds = appState.selectedPoints.pointIds;
      pointIds = Array.from(new Set(pointIds.concat(selectedPointIds)));
    }

    dispatch(_draftPointsDelete({ pointIds, messageId }));
  };
};

export interface _DraftPointsDeleteParams
  extends Omit<DraftPointsDeleteParams, "deleteSelectedPoints"> {
  messageId: string;
  pointIds: string[];
}

export const _draftPointsDelete = (
  params: _DraftPointsDeleteParams
): Action<_DraftPointsDeleteParams> => {
  return {
    type: Actions.draftPointsDelete,
    params,
  };
};

export interface CombinePointsParams {
  shape: PointShape;
  messageId: string;
  keepIndex: number;
  deleteIndex: number;
}

export const combinePoints = (
  params: CombinePointsParams
): ThunkAction<void, AppState, unknown, Action<_CombinePointsParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    const { shape, messageId, keepIndex, deleteIndex } = params;
    const message = appState.draftMessages.byId[messageId];

    const withinBounds = (index: number): boolean => {
      return index >= 0 && index < message.shapes[shape].length;
    };

    const isQuoted = (index: number): boolean => {
      const pointId = message.shapes[shape][index];
      return !!getReferencedPointId(pointId, appState);
    };

    if (
      // Only combine points with points that exist
      !withinBounds(keepIndex) ||
      !withinBounds(deleteIndex) ||
      // Only combine points with non-quoted points
      isQuoted(keepIndex) ||
      isQuoted(deleteIndex)
    ) {
      return;
    }

    const pointToKeepId = message.shapes[shape][keepIndex];
    const pointToKeep = getPointById(pointToKeepId, appState) as PointI;
    const pointToDeleteId = message.shapes[shape][deleteIndex];

    dispatch(
      _combinePoints({
        pointToKeepId,
        pointToKeep,
        pointToDeleteId,
        messageId,
        ...params,
      })
    );
  };
};

export interface _CombinePointsParams extends CombinePointsParams {
  pointToKeepId: string;
  pointToKeep: PointI;
  pointToDeleteId: string;
  messageId: string;
}

export const _combinePoints = (
  params: _CombinePointsParams
): Action<_CombinePointsParams> => {
  return {
    type: Actions.combinePoints,
    params,
  };
};

export interface SplitIntoTwoPointsParams {
  pointId: string;
  sliceIndex: number;
  messageId: string;
}

export const splitIntoTwoPoints = (
  params: SplitIntoTwoPointsParams
): ThunkAction<void, AppState, unknown, Action<_SplitIntoTwoPointsParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    const point = getPointById(params.pointId, appState);
    if (isReference(point)) {
      return;
    }
    const { shape } = point;
    const { messageId } = params;
    const newPointId = uuidv4();
    dispatch(_splitIntoTwoPoints({ ...params, newPointId, messageId, shape }));
  };
};

export interface _SplitIntoTwoPointsParams extends SplitIntoTwoPointsParams {
  newPointId: string;
  messageId: string;
  shape: PointShape;
}

export const _splitIntoTwoPoints = (
  params: _SplitIntoTwoPointsParams
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
