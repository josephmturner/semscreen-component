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
import { AuthorI } from "../dataModels/dataModels";
import randomColor from "randomcolor";
import { Action } from "../actions/constants";

import { AppState } from "./store";

export interface UserIdentitiesState {
  byId: {
    [_id: string]: AuthorI;
  };
  allIds: string[];
  currentIdentity: string;
}

export const initialUserIdentitiesState: UserIdentitiesState = {
  byId: {
    author1: { _id: "author1", name: "anonymous", color: randomColor() },
  },
  allIds: ["author1"],
  currentIdentity: "author1",
};

export const userIdentitiesReducer = (
  state = initialUserIdentitiesState,
  action: Action,
  appState: AppState
): UserIdentitiesState => {
  return state;
};
