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
  getReferencedPointId,
  isReference,
} from "../dataModels/pointUtils";
import { AppState } from "./store";
import {
  _PointCreateParams,
  PointUpdateParams,
  _PointsMoveToMessageParams,
  PointsMoveWithinMessageParams,
  PointsDeleteParams,
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/draftPointsActions";
import {
  _MessageCreateParams,
  //TODO: Does it matter if I pass MessageDeleteParams to the points reducer,
  //which should never make use of the optional newMessageId prop?
  MessageDeleteParams,
} from "../actions/draftMessagesActions";
import { SyncWithLocalStorageParams } from "../actions/localStorageActions";
import { SaveMessageParams } from "../actions/dbActions";

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
    case Actions.pointCreate:
      newState = handlePointCreate(state, action as Action<_PointCreateParams>);
      break;
    case Actions.pointUpdate:
      newState = handlePointUpdate(state, action as Action<PointUpdateParams>);
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
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>,
        appState
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<CombinePointsParams>,
        appState
      );
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<_SplitIntoTwoPointsParams>
      );
      break;
    case Actions.messageCreate:
      newState = handleMessageCreate(
        state,
        action as Action<_MessageCreateParams>
      );
      break;
    case Actions.messageDelete:
      newState = handleMessageDelete(
        state,
        action as Action<MessageDeleteParams>,
        appState
      );
      break;
    case Actions.syncWithLocalStorage:
      newState = handleSyncWithLocalStorage(
        state,
        action as Action<SyncWithLocalStorageParams>
      );
      break;
    case Actions.saveMessage:
      newState = handleSaveMessage(state, action as Action<SaveMessageParams>);
      break;
  }
  return newState;
};

function handlePointCreate(
  state: DraftPointsState,
  action: Action<_PointCreateParams>
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

function handlePointUpdate(
  state: DraftPointsState,
  action: Action<PointUpdateParams>
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

function handlePointsDelete(
  state: DraftPointsState,
  action: Action<PointsDeleteParams>,
  appState: AppState
): DraftPointsState {
  let pointIds = action.params.pointIds;
  if (action.params.deleteSelectedPoints) {
    pointIds = pointIds.concat(appState.selectedPoints.pointIds);
  }

  return produce(state, (draft) => {
    pointIds.forEach((id) => {
      delete draft.byId[id];
      draft.allIds.filter((pId) => pId !== id);
    });
  });
}

//TODO: reuse withinBounds and isQuoted logic in src/reducers/message
//Is it good form to access appState in src/draftPointsActions?
//note: in src/reducers/message, state must be replaced with
//appState.points (and a similar change in this file)
function handleCombinePoints(
  state: DraftPointsState,
  action: Action<CombinePointsParams>,
  appState: AppState
): DraftPointsState {
  const currentMessage =
    appState.draftMessages.byId[appState.semanticScreen.currentMessage];
  const withinBounds = (index: number): boolean => {
    return (
      index >= 0 && index < currentMessage.shapes[action.params.shape].length
    );
  };

  const isQuoted = (index: number): boolean => {
    const pointId = currentMessage.shapes[action.params.shape][index];
    return !!getReferencedPointId(pointId, appState);
  };

  // Don't attempt to combine a point with the point below it if no point
  // exists below it.
  if (
    !withinBounds(action.params.keepIndex) ||
    !withinBounds(action.params.deleteIndex)
  ) {
    return state;
  }

  // Don't combine points with quoted points:
  if (
    isQuoted(action.params.keepIndex) ||
    isQuoted(action.params.deleteIndex)
  ) {
    return state;
  }

  const pointIdToKeep =
    currentMessage.shapes[action.params.shape][action.params.keepIndex];
  const pointIdToDelete =
    currentMessage.shapes[action.params.shape][action.params.deleteIndex];

  const newContent =
    action.params.keepIndex < action.params.deleteIndex
      ? getPointIfReference(pointIdToKeep, appState).content +
        getPointIfReference(pointIdToDelete, appState).content
      : getPointIfReference(pointIdToDelete, appState).content +
        getPointIfReference(pointIdToKeep, appState).content;
  return produce(state, (draft) => {
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

function handleMessageCreate(
  state: DraftPointsState,
  action: Action<_MessageCreateParams>
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

function handleMessageDelete(
  state: DraftPointsState,
  action: Action<MessageDeleteParams>,
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
      draft.allIds.filter((pId) => pId !== id);
    });
  });
}

const handleSyncWithLocalStorage = (
  state: DraftPointsState,
  action: Action<SyncWithLocalStorageParams>
): DraftPointsState => {
  return action.params.localStorageState.draftPoints;
};

const handleSaveMessage = (
  state: DraftPointsState,
  action: Action<SaveMessageParams>
): DraftPointsState => {
  return produce(state, (draft) => {
    Object.values(action.params.points).forEach((point) => {
      delete draft.byId[point._id];
      draft.allIds = draft.allIds.filter((id) => id !== point._id);
    });
  });
};
