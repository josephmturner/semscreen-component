import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";

import { AppState } from "../reducers/store";

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
