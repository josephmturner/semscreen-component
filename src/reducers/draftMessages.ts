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
} from "../dataModels/dataModels";
import {
  getPointIfReference,
  getReferenceData,
} from "../dataModels/pointUtils";
import {
  _DraftPointCreateParams,
  _PointsMoveToMessageParams,
  PointsMoveWithinMessageParams,
  DraftPointsDeleteParams,
  _CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/draftPointsActions";
import {
  _DraftMessageCreateParams,
  DraftMessageDeleteParams,
  SetMainParams,
} from "../actions/draftMessagesActions";

export interface DraftMessagesState {
  byId: {
    [_id: string]: DraftMessageI;
  };
  allIds: string[];
}

export const initialDraftMessagesState: DraftMessagesState = {
  byId: {},
  allIds: [],
};

export const draftMessagesReducer = (
  state = initialDraftMessagesState,
  action: Action,
  appState: AppState
): DraftMessagesState => {
  let newState = state;
  switch (action.type) {
    case Actions.draftMessageCreate:
      newState = handleDraftMessageCreate(
        state,
        action as Action<_DraftMessageCreateParams>
      );
      break;
    case Actions.draftMessageDelete:
      newState = handleDraftMessageDelete(
        state,
        action as Action<DraftMessageDeleteParams>
      );
      break;
    case Actions.draftPointCreate:
      newState = handleDraftPointCreate(
        state,
        action as Action<_DraftPointCreateParams>,
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
        action as Action<_PointsMoveToMessageParams>
      );
      break;
    case Actions.draftPointsDelete:
      newState = handleDraftPointsDelete(
        state,
        action as Action<DraftPointsDeleteParams>,
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
        action as Action<_CombinePointsParams>
      );
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<_SplitIntoTwoPointsParams>
      );
      break;
  }
  return newState;
};

function handleDraftMessageCreate(
  state: DraftMessagesState,
  action: Action<_DraftMessageCreateParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { newMessageId } = action.params;

    draft.byId[newMessageId] = {
      _id: newMessageId,
      //TODO: replace with author from ushin-db
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
}

function handleDraftMessageDelete(
  state: DraftMessagesState,
  action: Action<DraftMessageDeleteParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    delete draft.byId[action.params.messageId];
    draft.allIds = draft.allIds.filter((id) => id !== action.params.messageId);
  });
}

function handleDraftPointCreate(
  state: DraftMessagesState,
  action: Action<_DraftPointCreateParams>,
  appState: AppState
): DraftMessagesState {
  const shape = action.params.point.shape;

  return produce(state, (draft) => {
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    const currentMessage = draft.byId[currentMessageId];
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
  action: Action<_PointsMoveToMessageParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { newMessageId, newPoints, cutFromMessageId } = action.params;

    const newMessage = draft.byId[newMessageId];
    newPoints.forEach((point) => {
      const { _id, shape } = point;
      newMessage.shapes[shape].push(_id);
    });

    if (cutFromMessageId) {
      const cutFromMessage = draft.byId[cutFromMessageId];
      const pointsToCutIds = newPoints.map((p) => p._id);
      _deletePoints(cutFromMessage, pointsToCutIds);

      // If currentMessage is now empty, delete it
      if (
        Object.values(cutFromMessage.shapes).flat()[0] === undefined &&
        cutFromMessage.main === undefined
      ) {
        delete draft.byId[cutFromMessageId];
        draft.allIds = draft.allIds.filter((m) => m !== cutFromMessageId);
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

  const currentMessageId = appState.semanticScreen.currentMessage as string;
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

function handleDraftPointsDelete(
  state: DraftMessagesState,
  action: Action<DraftPointsDeleteParams>,
  appState: AppState
): DraftMessagesState {
  return produce(state, (draft) => {
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    const currentMessage = draft.byId[currentMessageId];

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

  const currentMessageId = appState.semanticScreen.currentMessage as string;
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
  action: Action<_CombinePointsParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { currentMessageId } = action.params;

    const currentMessage = draft.byId[currentMessageId];
    const currentShapes = currentMessage.shapes;

    currentShapes[action.params.shape] = currentShapes[
      action.params.shape
    ].filter((id) => id !== action.params.pointToDeleteId);
  });
}

function handleSplitIntoTwoPoints(
  state: DraftMessagesState,
  action: Action<_SplitIntoTwoPointsParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { currentMessageId, pointId, newPointId, shape } = action.params;
    const currentMessage = draft.byId[currentMessageId];

    const splitPointIndex =
      currentMessage.shapes[shape].findIndex((id) => id === pointId) + 1;
    currentMessage.shapes[shape].splice(splitPointIndex, 0, newPointId);
  });
}
