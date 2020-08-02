import { Action } from '../actions/constants';
import { createStore } from "redux";

import { initialEditingPointState, editingPointReducer, EditingPointState } from "./editingPoint";
import { initialCursorPositionState, cursorPositionReducer, CursorPositionState } from './cursorPosition';

export interface AppState {
  editingPoint: EditingPointState;
  cursorPosition: CursorPositionState;
}

const initialAppState: AppState = {
  editingPoint: initialEditingPointState,
  cursorPosition: initialCursorPositionState,
}

const appReducer = (state = initialAppState, action: Action): AppState => {
  let newState: AppState = {
    editingPoint: editingPointReducer(state.editingPoint, action, state),
    cursorPosition: cursorPositionReducer(state.cursorPosition, action, state),
  };
  return newState;
};

export const store = createStore(appReducer);
