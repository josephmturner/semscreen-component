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
import { Action, Actions } from "../actions/constants";
import produce from "immer";

import { allPointShapes, DraftMessageI } from "../dataModels/dataModels";
import {
  _DraftPointCreateParams,
  _PointsMoveToMessageParams,
  _PointsMoveWithinMessageParams,
  _DraftPointsDeleteParams,
  _CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/draftPointsActions";
import {
  _DraftMessageCreateParams,
  _DraftMessageDeleteParams,
  _SetMainParams,
} from "../actions/draftMessagesActions";
import { _SetCurrentMessageParams } from "../actions/selectPointActions";
import { _PublishMessageParams } from "../actions/dbActions";

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
  action: Action
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
        action as Action<_DraftMessageDeleteParams>
      );
      break;
    case Actions.draftPointCreate:
      newState = handleDraftPointCreate(
        state,
        action as Action<_DraftPointCreateParams>
      );
      break;
    case Actions.pointsMoveWithinMessage:
      newState = handlePointsMoveWithinMessage(
        state,
        action as Action<_PointsMoveWithinMessageParams>
      );
      break;
    case Actions.setCurrentMessage:
      newState = handleSetCurrentMessage(
        state,
        action as Action<_SetCurrentMessageParams>
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
        action as Action<_DraftPointsDeleteParams>
      );
      break;
    case Actions.setMain:
      newState = handleSetMain(state, action as Action<_SetMainParams>);
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
    case Actions.publishMessage:
      newState = handlePublishMessage(
        state,
        action as Action<_PublishMessageParams>
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
  action: Action<_DraftMessageDeleteParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    delete draft.byId[action.params.messageId];
    draft.allIds = draft.allIds.filter((id) => id !== action.params.messageId);
  });
}

function handleDraftPointCreate(
  state: DraftMessagesState,
  action: Action<_DraftPointCreateParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { messageId, point, newPointId, index, main } = action.params;

    const message = draft.byId[messageId];
    if (main) {
      message.main = newPointId;
    } else {
      message.shapes[point.shape].splice(index, 0, newPointId);
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

function _deleteIfEmpty(messageId: string, state: DraftMessagesState) {
  const message = state.byId[messageId];
  if (
    Object.values(message.shapes).flat().length === 0 &&
    message.main === undefined
  ) {
    delete state.byId[messageId];
    state.allIds = state.allIds.filter((id) => id !== messageId);
  }
}

function handleSetCurrentMessage(
  state: DraftMessagesState,
  action: Action<_SetCurrentMessageParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    if (state.allIds.includes(action.params.oldMessageId)) {
      _deleteIfEmpty(action.params.oldMessageId, draft);
    }
  });
}

function handlePointsMoveToMessage(
  state: DraftMessagesState,
  action: Action<_PointsMoveToMessageParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { moveToMessageId, movePoints, cutFromMessageId } = action.params;

    const moveToMessage = draft.byId[moveToMessageId];
    for (const { _id, shape } of movePoints) {
      moveToMessage.shapes[shape].push(_id);
    }

    if (cutFromMessageId) {
      const cutFromMessage = draft.byId[cutFromMessageId];
      const pointsToCutIds = movePoints.map((p) => p._id);

      _deletePoints(cutFromMessage, pointsToCutIds);
      _deleteIfEmpty(cutFromMessageId, draft);
    }
  });
}

function handlePointsMoveWithinMessage(
  state: DraftMessagesState,
  action: Action<_PointsMoveWithinMessageParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { messageId, pointsToMoveIds, region, index } = action.params;
    const message = draft.byId[messageId];
    let pointIds: string[] = message.shapes[region];
    let newPointIds: string[] = [];

    // Rebuild array of pointIds for state.shapes[region]
    pointIds.forEach((pointId: string, i: number) => {
      if (i === index) {
        newPointIds = newPointIds.concat(pointsToMoveIds);
      }

      if (!pointsToMoveIds.includes(pointId)) {
        newPointIds.push(pointId);
      }
    });

    if (index === pointIds.length) {
      newPointIds = newPointIds.concat(pointsToMoveIds);
    }

    // Delete points from original locations...
    _deletePoints(message, pointsToMoveIds);

    // then set the pointIds for the destination region
    message.shapes[region] = newPointIds;
  });
}

function handleDraftPointsDelete(
  state: DraftMessagesState,
  action: Action<_DraftPointsDeleteParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { pointIds, messageId } = action.params;
    const message = draft.byId[messageId];

    _deletePoints(message, pointIds);
  });
}

function handleSetMain(
  state: DraftMessagesState,
  action: Action<_SetMainParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const {
      newMainId,
      newMainShape,
      oldMainId,
      oldMainShape,
      messageId,
    } = action.params;
    const message = draft.byId[messageId];

    // Remove the point from the region it came from...
    message.shapes[newMainShape] = message.shapes[newMainShape].filter(
      (id) => id !== newMainId
    );

    // then move the current main point to the appropriate region
    if (oldMainId && oldMainShape) {
      message.shapes[oldMainShape].push(oldMainId);
    }
    message.main = newMainId;
  });
}

function handleCombinePoints(
  state: DraftMessagesState,
  action: Action<_CombinePointsParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { messageId } = action.params;

    const message = draft.byId[messageId];
    const shapes = message.shapes;

    shapes[action.params.shape] = shapes[action.params.shape].filter(
      (id) => id !== action.params.pointToDeleteId
    );
  });
}

function handleSplitIntoTwoPoints(
  state: DraftMessagesState,
  action: Action<_SplitIntoTwoPointsParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    const { messageId, pointId, newPointId, shape } = action.params;
    const message = draft.byId[messageId];

    const splitPointIndex =
      message.shapes[shape].findIndex((id) => id === pointId) + 1;
    message.shapes[shape].splice(splitPointIndex, 0, newPointId);
  });
}

function handlePublishMessage(
  state: DraftMessagesState,
  action: Action<_PublishMessageParams>
): DraftMessagesState {
  return produce(state, (draft) => {
    for (const message of action.params.messages) {
      const { _id } = message;
      delete draft.byId[_id];
      draft.allIds = draft.allIds.filter((id) => id !== _id);
    }
  });
}
