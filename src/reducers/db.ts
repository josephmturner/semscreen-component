/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import produce from "immer";

import { Action, Actions } from "../actions/constants";

import { _LoadDatabaseParams } from "../actions/dbActions";

import { USHINBase } from "ushin-db";

export interface DBState {
  loading: boolean;
  db: USHINBase | null;
}

export const initialDBState: DBState = {
  loading: true,
  db: null,
};

export const dbReducer = (state = initialDBState, action: Action): DBState => {
  let newState = state;
  switch (action.type) {
    case Actions.loadDatabase:
      newState = handleLoadDatabase(
        state,
        action as Action<_LoadDatabaseParams>
      );
      break;
  }
  return newState;
};

function handleLoadDatabase(
  state: DBState,
  action: Action<_LoadDatabaseParams>
) {
  return produce(state, (draft) => {
    draft.db = action.params.db;
    draft.loading = false;
  });
}
