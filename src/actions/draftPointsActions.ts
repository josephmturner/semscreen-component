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
  main?: boolean;
}

export const draftPointCreate = (
  params: DraftPointCreateParams
): ThunkAction<void, AppState, unknown, Action<_DraftPointCreateParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    const newPointId = uuidv4();
    dispatch(_draftPointCreate({ ...params, newPointId, currentMessageId }));
  };
};

export interface _DraftPointCreateParams extends DraftPointCreateParams {
  newPointId: string;
  currentMessageId: string;
}

export const _draftPointCreate = (
  params: _DraftPointCreateParams
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

    const currentMessageId = appState.semanticScreen.currentMessage as string;

    dispatch(
      _pointsMoveWithinMessage({
        currentMessageId,
        pointsToMoveIds,
        pointIdsExcludingReferencePoints,
        region,
        index,
      })
    );
  };
};

export interface _PointsMoveWithinMessageParams {
  currentMessageId: string;
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
  newMessageId: string;
  oldMessageId?: string;
}

export const pointsMoveToMessage = (
  params: PointsMoveToMessageParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_PointsMoveToMessageParams | DraftPointReferencesCreate>
> => {
  return (dispatch, getState) => {
    const appState: AppState = getState();

    const { newMessageId } = params;
    const oldMessageId =
      params.oldMessageId ?? (appState.semanticScreen.currentMessage as string);

    //Don't move points to the same message
    if (oldMessageId === newMessageId) {
      return;
    }

    // If the current message is a draft, cut the selected points
    // from the current message and paste them into the new one
    let cutFromMessageId: string | undefined = oldMessageId;
    let newPoints: (
      | PointReferenceWithShape
      | PointI
    )[] = appState.selectedPoints.pointIds.map((id) => {
      const point = getPointById(id, appState);

      // It is necessary to pass the shape along with each reference point
      // so the draftMessageReducer knows where in the shapes object to put it
      if (isReference(point)) {
        const shape = getOriginalShape(point, appState);

        return { ...point, shape };
      }

      return point;
    });

    // If the currentMessage is not a draft, create reference points
    // from the selected points (do not cut from the original message)
    if (!appState.draftMessages.allIds.includes(oldMessageId)) {
      cutFromMessageId = undefined;
      const _newPoints: PointReferenceI[] = [];
      newPoints = appState.selectedPoints.pointIds.map((pointId) => {
        const point = createReferenceTo(pointId, oldMessageId, appState);
        _newPoints.push(point);

        const shape = getOriginalShape(point, appState);
        return { ...point, shape };
      });
      // Create the new points (convert them to the correct type)

      dispatch(draftPointReferencesCreate({ points: _newPoints }));
    }

    dispatch(
      _pointsMoveToMessage({
        newMessageId,
        oldMessageId,
        newPoints,
        cutFromMessageId,
      })
    );
  };
};

export interface DraftPointReferencesCreate {
  points: (PointI | PointReferenceI)[];
}

export const draftPointReferencesCreate = (
  params: DraftPointReferencesCreate
): Action<DraftPointReferencesCreate> => {
  return {
    type: Actions.draftPointReferencesCreate,
    params,
  };
};

export interface _PointsMoveToMessageParams extends PointsMoveToMessageParams {
  newPoints: (PointI | PointReferenceWithShape)[];
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
  deleteSelectedPoints?: boolean;
}

export const draftPointsDelete = (
  params: DraftPointsDeleteParams
): ThunkAction<void, AppState, unknown, Action<_DraftPointsDeleteParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    const currentMessageId = appState.semanticScreen.currentMessage as string;

    let { pointIds, deleteSelectedPoints } = params;
    if (deleteSelectedPoints === true) {
      const selectedPoints = appState.selectedPoints.pointIds;
      pointIds = pointIds.concat(selectedPoints);
    }

    dispatch(
      _draftPointsDelete({ pointIds, currentMessageId, deleteSelectedPoints })
    );
  };
};

export interface _DraftPointsDeleteParams extends DraftPointsDeleteParams {
  currentMessageId: string;
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
    const appState = getState();
    const { shape, keepIndex, deleteIndex } = params;
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    const currentMessage = appState.draftMessages.byId[currentMessageId];

    const withinBounds = (index: number): boolean => {
      return index >= 0 && index < currentMessage.shapes[shape].length;
    };

    const isQuoted = (index: number): boolean => {
      const pointId = currentMessage.shapes[shape][index];
      return !!getReferencedPointId(pointId, appState);
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
    const pointToKeep = getPointById(pointToKeepId, appState) as PointI;
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
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    const newPointId = uuidv4();
    dispatch(
      _splitIntoTwoPoints({ ...params, newPointId, currentMessageId, shape })
    );
  };
};

export interface _SplitIntoTwoPointsParams extends SplitIntoTwoPointsParams {
  newPointId: string;
  currentMessageId: string;
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
