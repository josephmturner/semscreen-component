import { Action, Actions } from "../actions/constants";

import { MessageI } from "../dataModels/dataModels";
import { SearchResultParams } from "../actions/searchActions";

import { AppState } from "./store";

export interface SearchState {
  search: string;
  results: MessageI[];
}

export const initialSearchState: SearchState = {
  search: "",
  results: [],
};

export const searchReducer = (
  state = initialSearchState,
  action: Action,
  appState: AppState
): SearchState => {
  let newState = state;
  switch (action.type) {
    case Actions.searchResults:
      newState = handleSearchResults(
        state,
        action as Action<SearchResultParams>,
        appState
      );
      break;
  }

  return newState;
};

function handleSearchResults(
  state: SearchState,
  action: Action<SearchResultParams>,
  appState: AppState
) {
  return { ...state, ...action.params };
}
