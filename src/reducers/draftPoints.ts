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
import { Action, Actions } from "../actions/constants";
import produce from "immer";
import {
  PointI,
  PointReferenceI,
  isPointShape,
} from "../dataModels/dataModels";
import {
  getPointIfReference,
  getReferenceData,
  isReference,
} from "../dataModels/pointUtils";
import { AppState } from "./store";
import {
  _DraftPointCreateParams,
  DraftPointUpdateParams,
  _PointsMoveToMessageParams,
  PointsMoveWithinMessageParams,
  DraftPointsDeleteParams,
  _CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/draftPointsActions";
import {
  _DraftMessageCreateParams,
  DraftMessageDeleteParams,
} from "../actions/draftMessagesActions";

export interface DraftPointsState {
  byId: {
    [_id: string]: PointI | PointReferenceI;
  };
  allIds: string[];
}

export const initialDraftPointsState: DraftPointsState = {
  byId: {},
  allIds: [],
};

export const draftPointsReducer = (
  state: DraftPointsState,
  action: Action,
  appState: AppState
): DraftPointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.draftPointCreate:
      newState = handleDraftPointCreate(
        state,
        action as Action<_DraftPointCreateParams>
      );
      break;
    case Actions.draftPointUpdate:
      newState = handleDraftPointUpdate(
        state,
        action as Action<DraftPointUpdateParams>
      );
      break;
    case Actions.pointsMoveWithinMessage:
      newState = handlePointsMoveWithinMessage(
        state,
        action as Action<PointsMoveWithinMessageParams>,
        appState
      );
      break;
    case Actions.pointsMoveToMessage:
      newState = handlePointsMoveToMessage(
        state,
        action as Action<_PointsMoveToMessageParams>,
        appState
      );
      break;
    case Actions.draftPointsDelete:
      newState = handleDraftPointsDelete(
        state,
        action as Action<DraftPointsDeleteParams>,
        appState
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<_CombinePointsParams>,
        appState
      );
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<_SplitIntoTwoPointsParams>
      );
      break;
    case Actions.draftMessageCreate:
      newState = handleDraftMessageCreate(
        state,
        action as Action<_DraftMessageCreateParams>
      );
      break;
    case Actions.draftMessageDelete:
      newState = handleDraftMessageDelete(
        state,
        action as Action<DraftMessageDeleteParams>,
        appState
      );
      break;
  }
  return newState;
};

function handleDraftPointCreate(
  state: DraftPointsState,
  action: Action<_DraftPointCreateParams>
): DraftPointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.newPointId] = {
      ...action.params.point,
      _id: action.params.newPointId,
      pointDate: new Date(),
    };
    draft.allIds.push(action.params.newPointId);
  });
}

function handleDraftPointUpdate(
  state: DraftPointsState,
  action: Action<DraftPointUpdateParams>
): DraftPointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.point._id] = action.params.point;
  });
}

function handlePointsMoveWithinMessage(
  state: DraftPointsState,
  action: Action<PointsMoveWithinMessageParams>,
  appState: AppState
): DraftPointsState {
  if (appState.drag.context === null) return state;
  const { region } = appState.drag.context;

  if (!isPointShape(region)) return state;
  const pointIdsExcludingReferencePoints = appState.selectedPoints.pointIds.filter(
    (p) => !getReferenceData(p, appState)
  );
  return produce(state, (draft) => {
    pointIdsExcludingReferencePoints.forEach(
      (id) =>
        (draft.byId[id] = {
          ...draft.byId[id],
          shape: region,
        })
    );
  });
}

function handlePointsMoveToMessage(
  state: DraftPointsState,
  action: Action<_PointsMoveToMessageParams>,
  appState: AppState
): DraftPointsState {
  const { newReferencePoints } = action.params;

  if (newReferencePoints === undefined) {
    return state;
  }

  return produce(state, (draft) => {
    newReferencePoints.forEach((point) => {
      draft.byId[point._id] = point;
      draft.allIds.push(point._id);
    });
  });
}

function handleDraftPointsDelete(
  state: DraftPointsState,
  action: Action<DraftPointsDeleteParams>,
  appState: AppState
): DraftPointsState {
  let pointIds = action.params.pointIds;
  if (action.params.deleteSelectedPoints) {
    pointIds = pointIds.concat(appState.selectedPoints.pointIds);
  }

  return produce(state, (draft) => {
    pointIds.forEach((id) => {
      delete draft.byId[id];
      draft.allIds = draft.allIds.filter((pId) => pId !== id);
    });
  });
}

function handleCombinePoints(
  state: DraftPointsState,
  action: Action<_CombinePointsParams>,
  appState: AppState
): DraftPointsState {
  return produce(state, (draft) => {
    const {
      pointIdToKeep,
      keepIndex,
      pointIdToDelete,
      deleteIndex,
    } = action.params;

    const newContent =
      keepIndex < deleteIndex
        ? getPointIfReference(pointIdToKeep, appState).content +
          getPointIfReference(pointIdToDelete, appState).content
        : getPointIfReference(pointIdToDelete, appState).content +
          getPointIfReference(pointIdToKeep, appState).content;

    const pointToKeep = draft.byId[pointIdToKeep];
    // Type assertion is okay here since pointToKeep will never be a
    // reference point
    (pointToKeep as PointI).content = newContent;
    delete draft.byId[pointIdToDelete];
    draft.allIds.filter((id) => id !== pointIdToDelete);
  });
}

function handleSplitIntoTwoPoints(
  state: DraftPointsState,
  action: Action<_SplitIntoTwoPointsParams>
): DraftPointsState {
  return produce(state, (draft) => {
    const topPoint = draft.byId[action.params.pointId];
    if (isReference(topPoint)) {
      return draft;
    }

    const topContent = topPoint.content.slice(0, action.params.sliceIndex);
    const bottomContent = topPoint.content.slice(action.params.sliceIndex);

    topPoint.content = topContent;

    draft.byId[action.params.newPointId] = {
      content: bottomContent,
      _id: action.params.newPointId,
      shape: topPoint.shape,
      pointDate: new Date(),
    };
    draft.allIds.push(action.params.newPointId);
  });
}

function handleDraftMessageCreate(
  state: DraftPointsState,
  action: Action<_DraftMessageCreateParams>
): DraftPointsState {
  const { newReferencePoints } = action.params;

  if (newReferencePoints === undefined) {
    return state;
  }

  return produce(state, (draft) => {
    newReferencePoints.forEach((point) => {
      draft.byId[point._id] = point;
      draft.allIds.push(point._id);
    });
  });
}

function handleDraftMessageDelete(
  state: DraftPointsState,
  action: Action<DraftMessageDeleteParams>,
  appState: AppState
): DraftPointsState {
  const messageToDelete = appState.draftMessages.byId[action.params.messageId];
  let pointIdsToDelete = Object.values(messageToDelete.shapes).flat();

  if (messageToDelete.main !== undefined) {
    pointIdsToDelete.push(messageToDelete.main);
  }

  return produce(state, (draft) => {
    pointIdsToDelete.forEach((id) => {
      delete draft.byId[id];
      draft.allIds = draft.allIds.filter((pId) => pId !== id);
    });
  });
}
