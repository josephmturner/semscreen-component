import { Action } from "../actions/constants";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  initialEditingPointState,
  editingPointReducer,
  EditingPointState,
} from "./editingPoint";
import {
  initialCursorPositionState,
  cursorPositionReducer,
  CursorPositionState,
} from "./cursorPosition";
import { initialMessageState, messageReducer, MessageState } from "./message";
import {
  initialExpandedRegionState,
  expandedRegionReducer,
  ExpandedRegionState,
} from "./expandedRegion";

export interface AppState {
  editingPoint: EditingPointState;
  cursorPosition: CursorPositionState;
  message: MessageState;
  expandedRegion: ExpandedRegionState;
}

export function createStoreWithMessage(message?: MessageState) {
  const initialAppState: AppState = {
    editingPoint: initialEditingPointState,
    cursorPosition: initialCursorPositionState,
    message: message ?? initialMessageState,
    expandedRegion: initialExpandedRegionState,
  };

  const appReducer = (state = initialAppState, action: Action): AppState => {
    let newState: AppState = {
      editingPoint: editingPointReducer(state.editingPoint, action, state),
      cursorPosition: cursorPositionReducer(
        state.cursorPosition,
        action,
        state
      ),
      message: messageReducer(state.message, action, state),
      expandedRegion: expandedRegionReducer(
        state.expandedRegion,
        action,
        state
      ),
    };
    return newState;
  };
  return createStore(appReducer, composeWithDevTools());
}
