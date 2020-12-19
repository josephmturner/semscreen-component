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
import { AppState } from "./store";
import produce from "immer";

import {
  allPointShapes,
  DraftMessageI,
  isPointShape,
  PointI,
  PointReferenceI,
} from "../dataModels/dataModels";
import {
  getPointIfReference,
  getPointById,
  getReferenceData,
  getReferencedPointId,
  isReference,
  getOriginalShape,
  containsPoints,
} from "../dataModels/pointUtils";
import {
  _PointCreateParams,
  _PointsMoveToMessageParams,
  PointsMoveWithinMessageParams,
  PointsDeleteParams,
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/draftPointsActions";
import {
  _MessageCreateParams,
  _MessageDeleteParams,
  SetMainParams,
} from "../actions/draftMessagesActions";
import { SetCurrentMessageParams } from "../actions/semanticScreenActions";
import { SyncWithLocalStorageParams } from "../actions/localStorageActions";
import { SaveMessageParams } from "../actions/dbActions";

export interface DraftMessagesState {
  byId: {
    [_id: string]: DraftMessageI;
  };
  allIds: string[];
}

//TODO: Would it be better to not have initial message data, since
//the author information should come from PouchDB anyway (and
//therefore shouldn't be hardcoded here)
export const initialDraftMessagesState: DraftMessagesState = {
  byId: {
    message0: {
      _id: "message0",
      author: "author",
      shapes: {
        facts: [],
        thoughts: [],
        feelings: [],
        needs: [],
        topics: [],
        actions: [],
        people: [],
      },
      createdAt: new Date(),
    },
  },
  allIds: ["message0"],
};

export const draftMessagesReducer = (
  state = initialDraftMessagesState,
  action: Action,
  appState: AppState
): DraftMessagesState => {
  let newState = state;
  switch (action.type) {
    case Actions.messageCreate:
      newState = handleMessageCreate(
        state,
        action as Action<_MessageCreateParams>,
        appState
      );
      break;
    case Actions.messageDelete:
      newState = handleMessageDelete(
        state,
        action as Action<_MessageDeleteParams>,
        appState
      );
      break;
    case Actions.pointCreate:
      newState = handlePointCreate(
        state,
        action as Action<_PointCreateParams>,
        appState
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
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>,
        appState
      );
      break;
    case Actions.setMain:
      newState = handleSetMain(
        state,
        action as Action<SetMainParams>,
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
        action as Action<_SplitIntoTwoPointsParams>,
        appState
      );
      break;
    case Actions.setCurrentMessage:
      newState = handleSetCurrentMessage(
        state,
        action as Action<SetCurrentMessageParams>,
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

const _createEmptyMessage = (state: DraftMessagesState, newMessageId: string) =>
  produce(state, (draft) => {
    draft.byId[newMessageId] = {
      _id: newMessageId,
      author: "author",
      shapes: {
        facts: [],
        thoughts: [],
        feelings: [],
        needs: [],
        topics: [],
        actions: [],
        people: [],
      },
      createdAt: new Date(),
    };
    draft.allIds.unshift(newMessageId);
  });

function handleMessageCreate(
  state: DraftMessagesState,
  action: Action<_MessageCreateParams>,
  appState: AppState
): DraftMessagesState {
  //Prevent creation of many empty messages...

  if (!containsPoints(appState.semanticScreen.currentMessage, appState))
    return state;

  // Create a new message...

  let newState: DraftMessagesState = _createEmptyMessage(
    state,
    action.params.newMessageId
  );

  // Then use handlePointsMoveToMessage() to move the points into the new message

  const intermediateAction: Action<_PointsMoveToMessageParams> = {
    type: Actions.pointsMoveToMessage,
    params: {
      messageId: action.params.newMessageId,
      newReferencePoints: action.params.newReferencePoints,
    },
  };

  return handlePointsMoveToMessage(newState, intermediateAction, {
    ...appState,
    draftMessages: newState,
  });
}

function handleMessageDelete(
  state: DraftMessagesState,
  action: Action<_MessageDeleteParams>,
  appState: AppState
): DraftMessagesState {
  const messageId = action.params.messageId;

  let newState = produce(state, (draft) => {
    delete draft.byId[messageId];
    draft.allIds = draft.allIds.filter((id) => id !== messageId);
  });

  // Create a new message if the current message was deleted and no drafts are left
  if (action.params.newMessageId !== undefined) {
    newState = _createEmptyMessage(newState, action.params.newMessageId);
  }

  return newState;
}

function handlePointCreate(
  state: DraftMessagesState,
  action: Action<_PointCreateParams>,
  appState: AppState
): DraftMessagesState {
  const shape = action.params.point.shape;

  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];
    if (action.params.main) {
      currentMessage.main = action.params.newPointId;
    } else {
      currentMessage.shapes[shape].splice(
        action.params.index,
        0,
        action.params.newPointId
      );
    }
  });
}

function _deletePoints(message: DraftMessageI, pointIds: string[]) {
  //Delete pointIds from shapes arrays
  allPointShapes.forEach((shape) => {
    message.shapes[shape] = message.shapes[shape].filter(
      (id) => !pointIds.includes(id)
    );
  });

  // Delete main point if included in list of pointIds
  message.main && pointIds.includes(message.main) && delete message.main;
}

function handlePointsMoveToMessage(
  state: DraftMessagesState,
  action: Action<_PointsMoveToMessageParams>,
  appState: AppState
): DraftMessagesState {
  const { messageId } = action.params;
  const currentMessageId = appState.semanticScreen.currentMessage;

  if (messageId === appState.semanticScreen.currentMessage) {
    return state;
  }

  const points: (PointI | PointReferenceI)[] =
    action.params.newReferencePoints ??
    appState.selectedPoints.pointIds.map((pointId) => {
      return getPointById(pointId, appState);
    });

  const isCutAndPaste = action.params.newReferencePoints === undefined;

  return produce(state, (draft) => {
    const targetMessage = draft.byId[messageId];
    points.forEach((point) => {
      const shape = isReference(point)
        ? getOriginalShape(point, appState)
        : point.shape;
      targetMessage.shapes[shape].push(point._id);
    });

    if (isCutAndPaste) {
      const currentMessage = draft.byId[currentMessageId];
      _deletePoints(currentMessage, appState.selectedPoints.pointIds);

      // If currentMessage is now empty, delete it
      if (
        Object.values(currentMessage.shapes).flat()[0] === undefined &&
        currentMessage.main === undefined
      ) {
        delete draft.byId[currentMessageId];
        draft.allIds = draft.allIds.filter((m) => m !== currentMessageId);
      }
    }
  });
}

function handlePointsMoveWithinMessage(
  state: DraftMessagesState,
  action: Action<PointsMoveWithinMessageParams>,
  appState: AppState
): DraftMessagesState {
  if (appState.drag.context === null) return state;

  const { region, index } = appState.drag.context;

  if (!isPointShape(region)) return state;

  const pointsToMove = appState.selectedPoints.pointIds.filter(
    (p) =>
      !getReferenceData(p, appState) ||
      region === getPointIfReference(p, appState).shape
  );

  const currentMessageId = appState.semanticScreen.currentMessage;
  const pointIds: string[] = state.byId[currentMessageId].shapes[region];
  let newPointIds: string[] = [];

  // Rebuild array of pointIds for state.shapes[region]
  pointIds.forEach((pointId: string, i: number) => {
    if (i === index) {
      newPointIds = newPointIds.concat(pointsToMove);
    }

    if (!appState.selectedPoints.pointIds.includes(pointId)) {
      newPointIds.push(pointId);
    }
  });

  if (index === pointIds.length) {
    newPointIds = newPointIds.concat(pointsToMove);
  }

  return produce(state, (draft) => {
    const currentMessage = draft.byId[currentMessageId];

    // Delete points from original locations...
    _deletePoints(currentMessage, pointsToMove);

    // then set the pointIds for the destination region
    currentMessage.shapes[region] = newPointIds;
  });
}

function handlePointsDelete(
  state: DraftMessagesState,
  action: Action<PointsDeleteParams>,
  appState: AppState
): DraftMessagesState {
  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];

    let pointIds = action.params.pointIds;
    if (action.params.deleteSelectedPoints) {
      pointIds = pointIds.concat(appState.selectedPoints.pointIds);
    }

    _deletePoints(currentMessage, pointIds);
  });
}

function handleSetMain(
  state: DraftMessagesState,
  action: Action<SetMainParams>,
  appState: AppState
): DraftMessagesState {
  let newMain = appState.selectedPoints.pointIds[0];
  if (action.params.pointId) newMain = action.params.pointId;

  const currentMessageId = appState.semanticScreen.currentMessage;
  const currentMain = state.byId[currentMessageId].main;
  if (newMain === currentMain) return state;

  const newMainShape = getPointIfReference(newMain, appState).shape;

  return produce(state, (draft) => {
    const currentMessage = draft.byId[currentMessageId];

    // Remove the point from the region it came from...
    currentMessage.shapes[newMainShape] = currentMessage.shapes[
      newMainShape
    ].filter((id) => id !== newMain);

    // then move the current main point to the appropriate region
    if (currentMessage.main) {
      const oldMainShape = getPointIfReference(currentMessage.main, appState)
        .shape;
      currentMessage.shapes[oldMainShape].push(currentMessage.main);
    }
    currentMessage.main = newMain;
  });
}

function handleCombinePoints(
  state: DraftMessagesState,
  action: Action<CombinePointsParams>,
  appState: AppState
): DraftMessagesState {
  const currentMessageId = appState.semanticScreen.currentMessage;

  const withinBounds = (index: number): boolean => {
    return (
      index >= 0 &&
      index < state.byId[currentMessageId].shapes[action.params.shape].length
    );
  };

  const isQuoted = (index: number): boolean => {
    const pointId =
      state.byId[currentMessageId].shapes[action.params.shape][index];
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

  const pointIdToDelete =
    state.byId[currentMessageId].shapes[action.params.shape][
      action.params.deleteIndex
    ];
  return produce(state, (draft) => {
    draft.byId[currentMessageId].shapes[action.params.shape] = draft.byId[
      currentMessageId
    ].shapes[action.params.shape].filter((id) => id !== pointIdToDelete);
    draft.byId[currentMessageId].main === pointIdToDelete &&
      delete draft.byId[currentMessageId].main;
  });
}

function handleSplitIntoTwoPoints(
  state: DraftMessagesState,
  action: Action<_SplitIntoTwoPointsParams>,
  appState: AppState
): DraftMessagesState {
  const point = getPointById(action.params.pointId, appState);
  if (isReference(point)) {
    return state;
  }

  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];

    const shape = getPointIfReference(action.params.pointId, appState).shape;
    const splitPointIndex =
      currentMessage.shapes[shape].findIndex(
        (id) => id === action.params.pointId
      ) + 1;
    currentMessage.shapes[shape].splice(
      splitPointIndex,
      0,
      action.params.newPointId
    );
  });
}

const handleSetCurrentMessage = (
  state: DraftMessagesState,
  action: Action<SetCurrentMessageParams>,
  appState: AppState
): DraftMessagesState => {
  //Delete an empty message when the SemanticScreen no longer displays it
  const currentMessageId = appState.semanticScreen.currentMessage;
  if (
    containsPoints(currentMessageId, appState) ||
    action.params.messageId === currentMessageId
  )
    return state;
  return produce(state, (draft) => {
    delete draft.byId[currentMessageId];
    draft.allIds = draft.allIds.filter((id) => id !== currentMessageId);
  });
};

const handleSyncWithLocalStorage = (
  state: DraftMessagesState,
  action: Action<SyncWithLocalStorageParams>
): DraftMessagesState => {
  return action.params.localStorageState.draftMessages;
};

const handleSaveMessage = (
  state: DraftMessagesState,
  action: Action<SaveMessageParams>
): DraftMessagesState => {
  return produce(state, (draft) => {
    delete draft.byId[action.params.message._id];
    draft.allIds = draft.allIds.filter(
      (id) => id !== action.params.message._id
    );
  });
};
