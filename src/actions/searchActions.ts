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
import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";

import { AppState } from "../reducers";

import {
  _getMessagesAndPoints,
  _populateMessageAndPoints,
  _PopulateMessageAndPointsParams,
} from "./dbActions";

export interface SearchByContentParams {
  searchQuery: string;
}

export interface _SearchByContentParams extends SearchByContentParams {
  results: string[];
}

export const searchByContent = (
  params: SearchByContentParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_SearchByContentParams | _PopulateMessageAndPointsParams>
> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      if (!state.db.db)
        return console.warn("Tried to search before database was loaded");
      const db = state.db.db;

      const pointIds = await db.searchPointsByContent(params.searchQuery);
      const _results = await db.searchMessagesForPoints(pointIds);
      const results = _results.map((r) => r._id);
      const { messages, points } = await _getMessagesAndPoints(
        results,
        db,
        state
      );

      dispatch(_populateMessageAndPoints({ messages, points }));

      dispatch(
        _searchByContent({
          ...params,
          results,
        })
      );
    })();
  };
};

const _searchByContent = (
  params: _SearchByContentParams
): Action<_SearchByContentParams> => {
  return {
    type: Actions.searchByContent,
    params,
  };
};
