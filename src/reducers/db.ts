import produce from "immer";

import { Action, Actions } from "../actions/constants";

import { AppState } from "./store";
import { LoadDatabaseParams } from "../actions/dbActions";

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
        action as Action<LoadDatabaseParams>
      );
      break;
  }
  return newState;
};

function handleLoadDatabase(
  state: DBState,
  action: Action<LoadDatabaseParams>
) {
  return produce(state, (draft) => {
    draft.db = action.params.db;
    draft.loading = false;
  });
}
