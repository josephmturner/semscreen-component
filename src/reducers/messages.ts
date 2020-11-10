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
import { v4 as uuidv4 } from "uuid";

import {
  allPointShapes,
  MessageI,
  isPointShape,
  PointI,
  PointReferenceI,
} from "../dataModels/dataModels";
import {
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
} from "../actions/pointsActions";
import {
  _MessageCreateParams,
  _MessageDeleteParams,
  SetFocusParams,
  SetMainPointParams,
} from "../actions/messagesActions";
import { SetCurrentMessageParams } from "../actions/semanticScreenActions";

export interface MessagesState {
  byId: {
    [_id: string]: MessageI;
  };
  allMessages: string[];
  draftIds: string[];
}

export const initialMessagesState: MessagesState = {
  byId: {
    message0: {
      _id: uuidv4(),
      //TODO: Replace "author0" with user's id
      author: "author0",
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
  allMessages: ["message0"],
  draftIds: ["message0"],
};

export const messagesReducer = (
  state = initialMessagesState,
  action: Action,
  appState: AppState
): MessagesState => {
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
    case Actions.setFocus:
      newState = handleSetFocus(
        state,
        action as Action<SetFocusParams>,
        appState
      );
      break;
    case Actions.setMainPoint:
      newState = handleSetMainPoint(
        state,
        action as Action<SetMainPointParams>,
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
  }
  return newState;
};

//TODO: Fix type of draft
const _createEmptyMessage = (state: MessagesState, newMessageId: string) =>
  produce(state, (draft: any) => {
    draft.byId[newMessageId] = {
      _id: newMessageId,
      //TODO: Replace "author1" with user's id
      author: "author1",
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
    draft.allMessages.push(newMessageId);
    draft.draftIds.unshift(newMessageId);
  });

function handleMessageCreate(
  state: MessagesState,
  action: Action<_MessageCreateParams>,
  appState: AppState
): MessagesState {
  //Prevent creation of many empty messages...

  if (!containsPoints(appState.semanticScreen.currentMessage, appState))
    return state;

  // Create a new message...

  let newState: MessagesState = _createEmptyMessage(
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

  newState = handlePointsMoveToMessage(newState, intermediateAction, {
    ...appState,
    messages: newState,
  });

  return produce(newState, (draft) => {
    if (newState.byId[action.params.newMessageId].main === undefined) {
      // If main point is still undefined, we need to pick a main point.
      const newMainPointId = action.params.newReferencePoints
        ? action.params.newReferencePoints[0]._id
        : appState.selectedPoints.pointIds[0];

      draft.byId[action.params.newMessageId].main = newMainPointId;
    }
  });
}

function handleMessageDelete(
  state: MessagesState,
  action: Action<_MessageDeleteParams>,
  appState: AppState
): MessagesState {
  const messageId = action.params.messageId;

  let newState = produce(state, (draft) => {
    delete draft.byId[messageId];
    draft.draftIds = draft.draftIds.filter((id) => id !== messageId);
    draft.allMessages = draft.allMessages.filter((id) => id !== messageId);
  });

  // Create a new message if the current message was deleted and no drafts are left
  if (action.params.newMessageId !== undefined) {
    newState = _createEmptyMessage(newState, action.params.newMessageId);
  }

  return newState;
}

function handlePointCreate(
  state: MessagesState,
  action: Action<_PointCreateParams>,
  appState: AppState
): MessagesState {
  const shape = action.params.point.shape;

  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];
    if (action.params.focus) {
      currentMessage.focus = action.params.newPointId;
    } else {
      currentMessage.shapes[shape].splice(
        action.params.index,
        0,
        action.params.newPointId
      );
    }
    //Message.main should only be undefined if message has no points
    if (!currentMessage.main) {
      currentMessage.main = action.params.newPointId;
    }
  });
}

function _deletePoints(
  message: MessageI,
  pointIds: string[],
  keepMain?: boolean
) {
  //Delete pointIds from shapes arrays
  allPointShapes.forEach((shape) => {
    message.shapes[shape] = message.shapes[shape].filter(
      (id) => !pointIds.includes(id)
    );
  });

  // Delete focus point if included in list of pointIds
  message.focus && pointIds.includes(message.focus) && delete message.focus;

  // Reset main if possible (unless keepMain === true)
  if (message.main && pointIds.includes(message.main) && !keepMain) {
    const pointInShapes = Object.values(message.shapes).flat()[0];
    if (pointInShapes) {
      message.main = pointInShapes;
    } else {
      message.main = message.focus;
    }
  }
}

function handlePointsMoveToMessage(
  state: MessagesState,
  action: Action<_PointsMoveToMessageParams>,
  appState: AppState
): MessagesState {
  const { messageId } = action.params;
  const currentMessageId = appState.semanticScreen.currentMessage;

  if (messageId === appState.semanticScreen.currentMessage) {
    return state;
  }

  const points: (PointI | PointReferenceI)[] =
    action.params.newReferencePoints ??
    appState.selectedPoints.pointIds.map((pointId) => {
      return appState.points.byId[pointId];
    });

  const isCutAndPaste = action.params.newReferencePoints === undefined;

  return produce(state, (draft) => {
    const targetMessage = draft.byId[messageId];
    points.forEach((point) => {
      const shape = isReference(point)
        ? getOriginalShape(point, appState.points)
        : point.shape;
      targetMessage.shapes[shape].push(point._id);
    });

    if (isCutAndPaste) {
      const currentMessage = draft.byId[currentMessageId];
      _deletePoints(currentMessage, appState.selectedPoints.pointIds);

      // If currentMessage is now empty, delete it
      if (
        Object.values(currentMessage.shapes).flat()[0] === undefined &&
        currentMessage.focus === undefined
      ) {
        delete draft.byId[currentMessageId];
        draft.draftIds = draft.draftIds.filter((m) => m !== currentMessageId);
        draft.allMessages = draft.allMessages.filter(
          (m) => m !== currentMessageId
        );
      }
    }
  });
}

function handlePointsMoveWithinMessage(
  state: MessagesState,
  action: Action<PointsMoveWithinMessageParams>,
  appState: AppState
): MessagesState {
  if (appState.drag.context === null) return state;

  const { region, index } = appState.drag.context;

  if (!isPointShape(region)) return state;

  const pointsToMove = appState.selectedPoints.pointIds.filter(
    (p) =>
      !getReferenceData(p, appState.points) ||
      region === getPointById(p, appState.points).shape
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
    _deletePoints(currentMessage, pointsToMove, true);

    // then set the pointIds for the destination region
    currentMessage.shapes[region] = newPointIds;
  });
}

function handlePointsDelete(
  state: MessagesState,
  action: Action<PointsDeleteParams>,
  appState: AppState
): MessagesState {
  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];

    let pointIds = action.params.pointIds;
    pointIds = pointIds.concat(appState.selectedPoints.pointIds);

    _deletePoints(currentMessage, pointIds);
  });
}

function handleSetFocus(
  state: MessagesState,
  action: Action<SetFocusParams>,
  appState: AppState
): MessagesState {
  const newFocus = appState.selectedPoints.pointIds[0];
  if (!newFocus) return state;

  const newFocusShape = getPointById(newFocus, appState.points).shape;

  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];
    currentMessage.shapes[newFocusShape] = currentMessage.shapes[
      newFocusShape
    ].filter((id) => id !== newFocus);
    if (currentMessage.focus) {
      const oldFocusShape = getPointById(currentMessage.focus, appState.points)
        .shape;
      currentMessage.shapes[oldFocusShape].push(currentMessage.focus);
    }
    currentMessage.focus = newFocus;
  });
}

function handleSetMainPoint(
  state: MessagesState,
  action: Action<SetMainPointParams>,
  appState: AppState
): MessagesState {
  const currentMessageId = appState.semanticScreen.currentMessage;

  return {
    ...state,
    byId: {
      ...state.byId,
      [currentMessageId]: {
        ...state.byId[currentMessageId],
        main: action.params.pointId,
      },
    },
  };
}

function handleCombinePoints(
  state: MessagesState,
  action: Action<CombinePointsParams>,
  appState: AppState
): MessagesState {
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
    return !!getReferencedPointId(pointId, appState.points);
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
  state: MessagesState,
  action: Action<_SplitIntoTwoPointsParams>,
  appState: AppState
): MessagesState {
  const point = appState.points.byId[action.params.pointId];
  if (isReference(point)) {
    return state;
  }

  return produce(state, (draft) => {
    const currentMessage = draft.byId[appState.semanticScreen.currentMessage];

    const shape = getPointById(action.params.pointId, appState.points).shape;
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
  state: MessagesState,
  action: Action<SetCurrentMessageParams>,
  appState: AppState
) => {
  //Delete an empty message when the SemanticScreen no longer displays it
  const currentMessageId = appState.semanticScreen.currentMessage;
  if (
    containsPoints(currentMessageId, appState) ||
    action.params.messageId === currentMessageId
  )
    return state;
  return produce(state, (draft) => {
    delete draft.byId[currentMessageId];
    draft.draftIds = draft.draftIds.filter((id) => id !== currentMessageId);
    draft.allMessages = draft.allMessages.filter(
      (id) => id !== currentMessageId
    );
  });
};
