import { Action, Actions } from "../actions/constants";

import { _SearchByContentParams } from "../actions/searchActions";

export interface SearchState {
  searchQuery: string;
  results: string[];
}

export const initialSearchState: SearchState = {
  searchQuery: "",
  results: [],
};

export const searchReducer = (
  state = initialSearchState,
  action: Action
): SearchState => {
  let newState = state;
  switch (action.type) {
    case Actions.searchByContent:
      newState = handleSearchResults(
        state,
        action as Action<_SearchByContentParams>
      );
      break;
  }
  return newState;
};

function handleSearchResults(
  state: SearchState,
  action: Action<_SearchByContentParams>
) {
  return { ...state, ...action.params };
}
