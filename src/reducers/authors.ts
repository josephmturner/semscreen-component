/*
  Copyright (C) 2021 by USHIN, Inc.

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
import { AuthorI } from "../dataModels/dataModels";
import { Action, Actions } from "../actions/constants";
import { SetAuthorsParams } from "../actions/authorsActions";

export interface AuthorsState {
  byId: {
    [_id: string]: AuthorI;
  };
}

export const initialAuthorsState: AuthorsState = {
  byId: {},
};

export const authorsReducer = (
  state = initialAuthorsState,
  action: Action
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
