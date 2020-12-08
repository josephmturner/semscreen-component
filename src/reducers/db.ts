import { Action, Actions } from "../actions/constants";

import { AppState } from "./store";
import { DatabaseLoadedParams } from "../actions/dbActions";

import { USHINBase } from "ushin-db";

export interface DBState {
  loading: boolean;
  db: USHINBase | null;
}

export const initialDBState: DBState = {
  loading: true,
  db: null,
};

export const dbReducer = (
  state = initialDBState,
  action: Action,
  appState: AppState
): DBState => {
  let newState = state;
  switch (action.type) {
    case Actions.loadDatabase:
      newState = handleLoadDatabase(
        state,
        action as Action<DatabaseLoadedParams>,
        appState
      );
      break;
  }
  return newState;
};

function handleLoadDatabase(
  state: DBState,
  action: Action<DatabaseLoadedParams>,
  appState: AppState
) {
  return { ...state, db: action.params.db, loading: false };
}
