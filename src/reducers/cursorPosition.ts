import { Action, Actions } from '../actions/constants';
import { CursorPositionParams } from '../actions/cursorPositionActions';
import { CombinePointsParams, SplitIntoTwoPointsParams } from '../actions/messageActions';

import { AppState } from './store';

export interface Details {
  pointId: string;
  index: number;
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
      newState = handleSetCursorPosition(state, action as Action<CursorPositionParams>);
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(state, action as Action<CombinePointsParams>, appState);
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(state, action as Action<SplitIntoTwoPointsParams>, appState);
      break;
  }
  return newState;
};

function handleSetCursorPosition(state: CursorPositionState, action: Action<CursorPositionParams>): CursorPositionState {
  return {
    details: action.params.details,
  }
}

function handleCombinePoints(state: CursorPositionState, action: Action<CombinePointsParams>, appState: AppState): CursorPositionState {

  const prevPoint = appState.message.points[action.params.shape][action.params.index - 1];
  const currentPoint = appState.message.points[action.params.shape][action.params.index];

  const newCursorPosition =
    action.params.aboveOrBelow === "above"
      ? {
          pointId: prevPoint.pointId,
          index: prevPoint.content.length,
        }
      : {
          pointId: currentPoint.pointId,
          index: currentPoint.content.length,
        };

  return {
    details: newCursorPosition,
  }
}

function handleSplitIntoTwoPoints(state: CursorPositionState, action: Action<SplitIntoTwoPointsParams>, appState: AppState): CursorPositionState {
  return {
    details: { pointId: action.params.newPointId, index: 0 },
  }
}
