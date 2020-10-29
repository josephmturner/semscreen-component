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
import { getPointById } from "../dataModels/getters";
import { Action, Actions } from "../actions/constants";
import { CursorPositionParams } from "../actions/cursorPositionActions";
import { CombinePointsParams } from "../actions/pointsActions";

import { AppState } from "./store";

export interface Details {
  pointId: string;
  contentIndex: number;
}

export interface CursorPositionState {
  details?: Details;
}

export const initialCursorPositionState: CursorPositionState = {};

export const cursorPositionReducer = (
  state = initialCursorPositionState,
  action: Action,
  appState: AppState
): CursorPositionState => {
  let newState = state;
  switch (action.type) {
    case Actions.setCursorPosition:
      newState = handleSetCursorPosition(
        state,
        action as Action<CursorPositionParams>,
        appState
      );
      break;
    case Actions.clearCursorPosition:
      newState = handleClearCursorPosition(state, action);
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<CombinePointsParams>,
        appState
      );
      break;
  }
  return newState;
};

function handleSetCursorPosition(
  state: CursorPositionState,
  action: Action<CursorPositionParams>,
  appState: AppState
): CursorPositionState {
  let newState = state;

  const pointId = action.params.pointId;
  const point = getPointById(pointId, appState.points);
  const shape = point.shape;
  const currentMessage =
    appState.messages.byId[appState.semanticScreen.currentMessage];
  const pointIds = currentMessage.shapes[shape];
  const index = pointIds.findIndex((id) => id === pointId);
  const prevPointId = pointIds[index - 1];
  const nextPointId = pointIds[index + 1];

  if (action.params.moveTo === "beginningOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        contentIndex: 0,
      },
    };
  } else if (action.params.moveTo === "endOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        contentIndex: getPointById(prevPointId, appState.points).content.length,
      },
    };
  } else if (action.params.moveTo === "beginningOfNextPoint") {
    if (index !== pointIds.length - 1) {
      newState = {
        details: {
          pointId: nextPointId,
          contentIndex: 0,
        },
      };
    }
  } else {
    throw new Error(`Unknown moveTo param: ${action.params.moveTo}`);
  }
  return newState;
}

function handleClearCursorPosition(
  state: CursorPositionState,
  action: Action
): CursorPositionState {
  return {};
}

function handleCombinePoints(
  state: CursorPositionState,
  action: Action<CombinePointsParams>,
  appState: AppState
): CursorPositionState {
  const smallerIndex = Math.min(
    action.params.keepIndex,
    action.params.deleteIndex
  );

  const currentMessage =
    appState.messages.byId[appState.semanticScreen.currentMessage];
  const prevPointId = currentMessage.shapes[action.params.shape][smallerIndex];
  const prevPoint = getPointById(prevPointId, appState.points);

  const newCursorPosition = {
    pointId:
      currentMessage.shapes[action.params.shape][action.params.keepIndex],
    contentIndex: prevPoint.content.length,
  };

  return {
    details: newCursorPosition,
  };
}
