import { Action, Actions } from "../actions/constants";
import { EditingPointParams } from "../actions/editingPointActions";
import { _PointCreateParams } from '../actions/messageActions';

import { AppState } from "./store";

export interface EditingPointState {
  editingPointId: string;
}

export const initialEditingPointState: EditingPointState = {
  editingPointId: "",
};

export const editingPointReducer = (
  state = initialEditingPointState,
  action: Action,
  appState: AppState
): EditingPointState => {
  let newState = state;
  switch (action.type) {
    case Actions.setEditingPoint:
      newState = handleSetEditingPoint(
        state,
        action as Action<EditingPointParams>
      );
      break;
    case Actions.pointCreate:
      newState = handlePointCreate(
        state,
        action as Action<_PointCreateParams>
      );
      break;
  }
  return newState;
};

function handleSetEditingPoint(
  state: EditingPointState,
  action: Action<EditingPointParams>
): EditingPointState {
  return {
    editingPointId: action.params.pointId,
  };
}

function handlePointCreate(
  state: EditingPointState,
  action: Action<_PointCreateParams>
): EditingPointState {
  return {
    editingPointId: action.params.newPointId,
  };
}
