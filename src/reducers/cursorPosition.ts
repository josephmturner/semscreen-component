import { Action, Actions } from "../actions/constants";
import { CursorPositionParams } from "../actions/cursorPositionActions";
import { PointShape } from "../dataModels";
import {
  CombinePointsParams,
  SplitIntoTwoPointsParams,
} from "../actions/messageActions";

import { AppState } from "./store";

export interface Details {
  pointId: string;
  index: number;
  shape: PointShape;
}

export interface CursorPositionState {
  details: Details | null;
}

export const initialCursorPositionState: CursorPositionState = {
  details: null,
};

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
        action as Action<SplitIntoTwoPointsParams>,
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

  const { shape, index } = action.params;
  const points = appState.message.points[shape];

  if (action.params.moveTo === "beginningOfPriorPoint") {
    newState = {
      details: {
        pointId: points[index - 1]._id,
        index: 0,
        shape,
      },
    };
  } else if (action.params.moveTo === "endOfPriorPoint") {
    newState = {
      details: {
        pointId: points[index - 1]._id,
        index: points[index - 1].content.length,
        shape,
      },
    };
  } else if (action.params.moveTo === "beginningOfNextPoint") {
    if (index !== points.length - 1) {
      newState = {
        details: {
          pointId: points[index + 1]._id,
          index: 0,
          shape,
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
  return {
    details: null,
  };
}

function handleCombinePoints(
  state: CursorPositionState,
  action: Action<CombinePointsParams>,
  appState: AppState
): CursorPositionState {

  const smallerIndex = Math.min(action.params.keepIndex, action.params.deleteIndex);
  const biggerIndex = Math.max(action.params.keepIndex, action.params.deleteIndex);

  const prevPoint = appState.message.points[action.params.shape][smallerIndex];
  const currentPoint = appState.message.points[action.params.shape][biggerIndex];

  const newCursorPosition = {
    pointId: appState.message.points[action.params.shape][action.params.keepIndex]._id,
    index: prevPoint.content.length,
    shape: action.params.shape,
  };

  return {
    details: newCursorPosition,
  };
}

function handleSplitIntoTwoPoints(
  state: CursorPositionState,
  action: Action<SplitIntoTwoPointsParams>,
  appState: AppState
): CursorPositionState {
  return {
    details: {
      pointId: action.params.newPointId,
      index: 0,
      shape: action.params.shape,
    },
  };
}
