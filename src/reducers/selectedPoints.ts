import { Action, Actions } from "../actions/constants";
import {
  SetSelectedPointsParams,
  TogglePointParams,
} from "../actions/selectPointActions";
import {
  CombinePointsParams,
  PointsDeleteParams,
} from "../actions/pointsActions";
import { AppState } from "./store";

export interface SelectedPointsState {
  pointIds: string[];
}

export const initialSelectedPointsState: SelectedPointsState = {
  pointIds: [],
};

export const selectedPointsReducer = (
  state = initialSelectedPointsState,
  action: Action,
  appState: AppState
): SelectedPointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.setSelectedPoints:
      newState = handleSetSelectedPoints(
        state,
        action as Action<SetSelectedPointsParams>
      );
      break;
    case Actions.togglePoint:
      newState = handleTogglePoint(state, action as Action<TogglePointParams>);
      break;
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>
      );
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

function handleSetSelectedPoints(
  state: SelectedPointsState,
  action: Action<SetSelectedPointsParams>
): SelectedPointsState {
  return {
    pointIds: action.params.pointIds,
  };
}

function handleTogglePoint(
  state: SelectedPointsState,
  action: Action<TogglePointParams>
): SelectedPointsState {
  const newPointIds = state.pointIds.filter(
    (pointId) => pointId !== action.params.pointId
  );
  if (newPointIds.length === state.pointIds.length) {
    newPointIds.push(action.params.pointId);
  }
  return {
    pointIds: newPointIds,
  };
}

function handlePointsDelete(
  state: SelectedPointsState,
  action: Action<PointsDeleteParams>
): SelectedPointsState {
  const newPointIds = state.pointIds.filter((pointId) => {
    return !action.params.pointIds.includes(pointId);
  });
  return {
    pointIds: newPointIds,
  };
}

function handleCombinePoints(
  state: SelectedPointsState,
  action: Action<CombinePointsParams>,
  appState: AppState
): SelectedPointsState {
  const deletedPointId =
    appState.message.shapes[action.params.shape][action.params.deleteIndex];
  return {
    pointIds: state.pointIds.filter((id) => id !== deletedPointId),
  };
}
