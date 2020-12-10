import { AuthorI } from "../dataModels/dataModels";
import randomColor from "randomcolor";
import { Action, Actions } from "../actions/constants";
import { SetAuthorsParams } from "../actions/authorsActions";

import { AppState } from "./store";

export interface AuthorsState {
  byId: {
    [_id: string]: AuthorI;
  };
}

export const initialAuthorsState: AuthorsState = {
  byId: {
    author1: { _id: "author1", name: "anonymous", color: randomColor() },
  },
};

export const authorsReducer = (
  state = initialAuthorsState,
  action: Action,
  appState: AppState
): AuthorsState => {
  let newState = state;
  switch (action.type) {
    case Actions.setAuthors:
      newState = handleSetAuthors(state, action as Action<SetAuthorsParams>);
      break;
  }
  return newState;
};

function handleSetAuthors(
  state: AuthorsState,
  action: Action<SetAuthorsParams>
): AuthorsState {
  return state;
}
