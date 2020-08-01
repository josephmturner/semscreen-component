import { combineReducers } from "redux";
import { editingPointReducer, EditingPointState } from "./editingPoint";

export interface AppState {
  editingPoint: EditingPointState;
}

export const appReducer = combineReducers<AppState>({
  editingPoint: editingPointReducer,
});
