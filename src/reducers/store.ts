import { Action } from "../actions/constants";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import {
  initialCursorPositionState,
  cursorPositionReducer,
  CursorPositionState,
} from "./cursorPosition";
import { initialPointsState, pointsReducer, PointsState } from "./points";
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
import { initialPanelsState, panelsReducer, PanelsState } from "./panels";

import { messages, points } from "../constants/initialState";

// Set this to false if you don't want initial message data.
const populate = true ? true : false;
const populatedInitialMessageState = populate ? messages[0] : null;
const populatedInitialPointsState = populate ? points : null;

export interface AppState {
  cursorPosition: CursorPositionState;
  points: PointsState;
  message: MessageState;
  expandedRegion: ExpandedRegionState;
  selectedPoints: SelectedPointsState;
  panels: PanelsState;
}

function createAppStore() {
  const initialAppState: AppState = {
    cursorPosition: initialCursorPositionState,
    points: populatedInitialPointsState ?? initialPointsState,
    message: populatedInitialMessageState ?? initialMessageState,
    expandedRegion: initialExpandedRegionState,
    selectedPoints: initialSelectedPointsState,
    panels: initialPanelsState,
  };

  const appReducer = (state = initialAppState, action: Action): AppState => {
    let newState: AppState = {
      cursorPosition: cursorPositionReducer(
        state.cursorPosition,
        action,
        state
      ),
      points: pointsReducer(state.points, action, state),
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
      panels: panelsReducer(state.panels, action, state),
    };
    return newState;
  };
  return createStore(appReducer, composeWithDevTools());
}

export const store = createAppStore();
