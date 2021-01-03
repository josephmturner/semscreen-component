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
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import {
  cursorPositionReducer as cursorPosition,
  CursorPositionState,
} from "./cursorPosition";
import {
  userIdentitiesReducer as userIdentities,
  UserIdentitiesState,
} from "./userIdentities";
import { authorsReducer as authors, AuthorsState } from "./authors";
import { messagesReducer as messages, MessagesState } from "./messages";
import { pointsReducer as points, PointsState } from "./points";
import {
  draftMessagesReducer as draftMessages,
  DraftMessagesState,
} from "./draftMessages";
import {
  draftPointsReducer as draftPoints,
  DraftPointsState,
} from "./draftPoints";
import {
  expandedRegionReducer as expandedRegion,
  ExpandedRegionState,
} from "./expandedRegion";
import {
  selectedPointsReducer as selectedPoints,
  SelectedPointsState,
} from "./selectedPoints";
import { panelsReducer as panels, PanelsState } from "./panels";
import { dragReducer as drag, DragState } from "./drag";
import {
  semanticScreenReducer as semanticScreen,
  SemanticScreenState,
} from "./semanticScreen";
import { DBState, dbReducer as db } from "./db";
import { SearchState, searchReducer as search } from "./search";
import { DisplayAppState, displayAppReducer as displayApp } from "./displayApp";

export interface AppState {
  db: DBState;
  userIdentities: UserIdentitiesState;
  cursorPosition: CursorPositionState;
  authors: AuthorsState;
  messages: MessagesState;
  points: PointsState;
  draftMessages: DraftMessagesState;
  draftPoints: DraftPointsState;
  expandedRegion: ExpandedRegionState;
  selectedPoints: SelectedPointsState;
  panels: PanelsState;
  drag: DragState;
  semanticScreen: SemanticScreenState;
  search: SearchState;
  displayApp: DisplayAppState;
}

const rootReducer = combineReducers({
  db,
  userIdentities,
  cursorPosition,
  authors,
  messages,
  points,
  draftMessages,
  draftPoints,
  expandedRegion,
  selectedPoints,
  panels,
  drag,
  semanticScreen,
  search,
  displayApp,
});

let preloadedDraftMessagesState: DraftMessagesState | undefined;
let preloadedDraftPointsState: DraftPointsState | undefined;
let preloadedSemanticScreenState: SemanticScreenState | undefined;

const rawLocalStorageState = localStorage.getItem("localStorageState");
const localStorageState = rawLocalStorageState
  ? JSON.parse(rawLocalStorageState)
  : null;
if (localStorageState) {
  preloadedDraftMessagesState = localStorageState.draftMessages;
  preloadedDraftPointsState = localStorageState.draftPoints;
  preloadedSemanticScreenState = localStorageState.semanticScreen;
}

export const store = createStore(
  rootReducer,
  {
    draftMessages: preloadedDraftMessagesState,
    draftPoints: preloadedDraftPointsState,
    semanticScreen: preloadedSemanticScreenState,
  },
  composeWithDevTools(applyMiddleware(thunk))
);
