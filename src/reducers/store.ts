import { Action } from "../actions/constants";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

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
import {
  initialSelectedPointsState,
  selectedPointsReducer,
  SelectedPointsState,
} from "./selectedPoints";

export interface AppState {
  editingPoint: EditingPointState;
  cursorPosition: CursorPositionState;
  message: MessageState;
  expandedRegion: ExpandedRegionState;
  selectedPoints: SelectedPointsState;
}

function createAppStore() {
  const initialAppState: AppState = {
    editingPoint: initialEditingPointState,
    cursorPosition: initialCursorPositionState,
    message: initialMessageState,
    expandedRegion: initialExpandedRegionState,
    selectedPoints: initialSelectedPointsState,
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
      selectedPoints: selectedPointsReducer(state.selectedPoints, action, state),
    };
    return newState;
  };
  return createStore(appReducer, composeWithDevTools());
}

export { createAppStore as createStore };
