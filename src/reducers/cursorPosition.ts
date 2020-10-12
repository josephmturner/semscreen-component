import { Action, Actions } from "../actions/constants";
import { CursorPositionParams } from "../actions/cursorPositionActions";
import {
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/pointsActions";

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

function handleSetCursorPosition(
  state: CursorPositionState,
  action: Action<CursorPositionParams>,
  appState: AppState
): CursorPositionState {
  let newState = state;

  const pointId = action.params.pointId;
  const point = appState.points.byId[pointId];
  const shape = point.shape;
  const pointIds = appState.message.shapes[shape];
  const index = pointIds.findIndex((id) => id === pointId);
  const prevPointId = pointIds[index - 1];
  const prevPoint = appState.points.byId[prevPointId];
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
        contentIndex: prevPoint.content.length,
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

  const prevPointId =
    appState.message.shapes[action.params.shape][smallerIndex];
  const prevPoint = appState.points.byId[prevPointId];

  const newCursorPosition = {
    pointId:
      appState.message.shapes[action.params.shape][action.params.keepIndex],
    contentIndex: prevPoint.content.length,
  };

  return {
    details: newCursorPosition,
  };
}

function handleSplitIntoTwoPoints(
  state: CursorPositionState,
  action: Action<_SplitIntoTwoPointsParams>,
  appState: AppState
): CursorPositionState {
  return {
    details: {
      pointId: action.params.newPointId,
      contentIndex: 0,
    },
  };
}
