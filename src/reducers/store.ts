/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import { Action } from "../actions/constants";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import {
  initialCursorPositionState,
  cursorPositionReducer,
  CursorPositionState,
} from "./cursorPosition";
import { initialAuthorsState, authorsReducer, AuthorsState } from "./authors";
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
import { initialDragState, dragReducer, DragState } from "./drag";

import { authors, messages, points } from "../constants/initialState";

// Set this to false if you don't want test data.
const populate = true;
const populatedInitialAuthorsState = populate ? authors : null;
const populatedInitialMessageState = populate ? messages[0] : null;
const populatedInitialPointsState = populate ? points : null;

export interface AppState {
  cursorPosition: CursorPositionState;
  authors: AuthorsState;
  points: PointsState;
  message: MessageState;
  expandedRegion: ExpandedRegionState;
  selectedPoints: SelectedPointsState;
  panels: PanelsState;
  drag: DragState;
}

function createAppStore() {
  const initialAppState: AppState = {
    cursorPosition: initialCursorPositionState,
    authors: populatedInitialAuthorsState ?? initialAuthorsState,
    points: populatedInitialPointsState ?? initialPointsState,
    message: populatedInitialMessageState ?? initialMessageState,
    expandedRegion: initialExpandedRegionState,
    selectedPoints: initialSelectedPointsState,
    panels: initialPanelsState,
    drag: initialDragState,
  };

  const appReducer = (state = initialAppState, action: Action): AppState => {
    let newState: AppState = {
      cursorPosition: cursorPositionReducer(
        state.cursorPosition,
        action,
        state
      ),
      authors: authorsReducer(state.authors, action, state),
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
      drag: dragReducer(state.drag, action, state),
    };
    return newState;
  };
  return createStore(appReducer, composeWithDevTools());
}

export const store = createAppStore();
