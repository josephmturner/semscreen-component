import { Action, Actions } from '../actions/constants';
import { EditingPointParams } from "../actions/editingPointActions";

import { AppState } from './store';

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
      newState = handleSetEditingPoint(state, action as Action<EditingPointParams>);
      break;
  }
  return newState;
};

function handleSetEditingPoint(state: EditingPointState, action: Action<EditingPointParams>): EditingPointState {
  return {
    editingPointId: action.params.pointId,
  };
}
