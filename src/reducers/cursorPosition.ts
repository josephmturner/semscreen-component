import { Action, Actions } from "../actions/constants";
import { CursorPositionParams } from "../actions/cursorPositionActions";
import { PointShape } from "../dataModels";
import {
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/pointsActions";

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

  const { pointId, index } = action.params;
  const point = appState.points.byId[pointId];
  const shape = point.shape;
  const pointIds = appState.message.shapes[shape];
  const prevPointId = pointIds[index - 1];
  const prevPoint = appState.points.byId[prevPointId];
  const nextPointId = pointIds[index + 1];

  if (action.params.moveTo === "beginningOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        index: 0,
        shape,
      },
    };
  } else if (action.params.moveTo === "endOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        index: prevPoint.content.length,
        shape,
      },
    };
  } else if (action.params.moveTo === "beginningOfNextPoint") {
    if (index !== pointIds.length - 1) {
      newState = {
        details: {
          pointId: nextPointId,
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
    index: prevPoint.content.length,
    shape: action.params.shape,
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
  const shape = appState.points.byId[action.params.pointId].shape;
  return {
    details: {
      pointId: action.params.newPointId,
      index: 0,
      shape,
    },
  };
}
