import { Action } from "../actions/constants";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

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

import { messages } from "../constants/initialState";

// Set this to false if you don't want initial message data.
const populatedInitialMessageState = true ? messages[0] : null;

export interface AppState {
  cursorPosition: CursorPositionState;
  message: MessageState;
  expandedRegion: ExpandedRegionState;
  selectedPoints: SelectedPointsState;
}

function createAppStore() {
  const initialAppState: AppState = {
    cursorPosition: initialCursorPositionState,
    message: populatedInitialMessageState ?? initialMessageState,
    expandedRegion: initialExpandedRegionState,
    selectedPoints: initialSelectedPointsState,
  };

  const appReducer = (state = initialAppState, action: Action): AppState => {
    let newState: AppState = {
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
      selectedPoints: selectedPointsReducer(
        state.selectedPoints,
        action,
        state
      ),
    };
    return newState;
  };
  return createStore(appReducer, composeWithDevTools());
}

export const store = createAppStore();
