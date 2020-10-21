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

import { allPointShapes, ShapesI } from "../dataModels/dataModels";
import { getPointById, getReferencedPointId } from "../dataModels/getters";
import {
  _PointCreateParams,
  PointMoveParams,
  PointsDeleteParams,
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/pointsActions";
import { SetFocusParams, SetMainPointParams } from "../actions/messageActions";

export interface MessageState {
  _id: string;
  revisionOf?: string;
  author: string;
  shapes: ShapesI;
  focus?: string;
  main?: string;
  createdAt: Date;
}

export const initialMessageState: MessageState = {
  _id: uuidv4(),
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
};

export const messageReducer = (
  state = initialMessageState,
  action: Action,
  appState: AppState
): MessageState => {
  let newState = state;
  switch (action.type) {
    case Actions.pointCreate:
      newState = handlePointCreate(state, action as Action<_PointCreateParams>);
      break;
    case Actions.pointMove:
      newState = handlePointMove(
        state,
        action as Action<PointMoveParams>,
        appState
      );
      break;
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>
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
        action as Action<SetMainPointParams>
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
  }
  return newState;
};

//function setMessage(
//  state: MessageState,
//  action: Action<SetMessageParams>
//): MessageState {
//  return action.params.message;
//}

function handlePointCreate(
  state: MessageState,
  action: Action<_PointCreateParams>
): MessageState {
  const shape = action.params.point.shape;

  return produce(state, (draft) => {
    if (action.params.focus) {
      draft.focus = action.params.newPointId;
    } else if (typeof action.params.index === "number") {
      draft.shapes[shape].splice(
        action.params.index,
        0,
        action.params.newPointId
      );
    }
  });
}

function handlePointMove(
  state: MessageState,
  action: Action<PointMoveParams>,
  appState: AppState
): MessageState {
  //TODO: oldShape also gets defined later in handleSetFocus. Can we
  //reuse it?
  const oldShape = getPointById(action.params.pointId, appState.points).shape;

  return produce(state, (draft) => {
    //If point was the focus (lacks index)...
    if (typeof action.params.oldIndex !== "number") {
      draft.shapes[action.params.newShape].splice(
        action.params.newIndex,
        0,
        action.params.pointId
      );
      delete draft.focus;
      //If point was already inside the region...
    } else if (oldShape === action.params.newShape) {
      draft.shapes[oldShape].splice(action.params.oldIndex, 1);
      draft.shapes[oldShape].splice(
        action.params.newIndex,
        0,
        action.params.pointId
      );
    } else {
      draft.shapes[oldShape].splice(action.params.oldIndex, 1);
      draft.shapes[action.params.newShape].splice(
        action.params.newIndex,
        0,
        action.params.pointId
      );
    }
  });
}

function handlePointsDelete(
  state: MessageState,
  action: Action<PointsDeleteParams>
): MessageState {
  return produce(state, (draft) => {
    allPointShapes.forEach((shape) => {
      draft.shapes[shape] = draft.shapes[shape].filter(
        (id) => !action.params.pointIds.includes(id)
      );
    });
    draft.focus &&
      action.params.pointIds.includes(draft.focus) &&
      delete draft.focus;
    draft.main &&
      action.params.pointIds.includes(draft.main) &&
      delete draft.main;
  });
}

function handleSetFocus(
  state: MessageState,
  action: Action<SetFocusParams>,
  appState: AppState
): MessageState {
  //newFocusShape refers to the current shape of the point.
  //Note that this may be different from its originalShape.
  const newFocusShape = getPointById(action.params.pointId, appState.points)
    .shape;

  return produce(state, (draft) => {
    draft.shapes[newFocusShape] = draft.shapes[newFocusShape].filter(
      (id) => id !== action.params.pointId
    );
    if (draft.focus) {
      const oldFocusShape = getPointById(draft.focus, appState.points).shape;
      draft.shapes[oldFocusShape].push(draft.focus);
    }
    draft.focus = action.params.pointId;
  });
}

function handleSetMainPoint(
  state: MessageState,
  action: Action<SetMainPointParams>
): MessageState {
  return {
    ...state,
    main: action.params.pointId,
  };
}

function handleCombinePoints(
  state: MessageState,
  action: Action<CombinePointsParams>,
  appState: AppState
): MessageState {
  const withinBounds = (index: number): boolean => {
    return index >= 0 && index < state.shapes[action.params.shape].length;
  };

  const isQuoted = (index: number): boolean => {
    const pointId = state.shapes[action.params.shape][index];
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
    state.shapes[action.params.shape][action.params.deleteIndex];
  return produce(state, (draft) => {
    draft.shapes[action.params.shape] = draft.shapes[
      action.params.shape
    ].filter((id) => id !== pointIdToDelete);
    draft.main === pointIdToDelete && delete draft.main;
  });
}

function handleSplitIntoTwoPoints(
  state: MessageState,
  action: Action<_SplitIntoTwoPointsParams>,
  appState: AppState
): MessageState {
  return produce(state, (draft) => {
    const shape = getPointById(action.params.pointId, appState.points).shape;
    const splitPointIndex =
      draft.shapes[shape].findIndex((id) => id === action.params.pointId) + 1;
    draft.shapes[shape].splice(splitPointIndex, 0, action.params.newPointId);
  });
}
