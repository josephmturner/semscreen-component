import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";

import { AppState } from "../reducers/store";
import { MessageI } from "../dataModels/dataModels";

export interface SearchByContentParams {
  searchQuery: string;
}

export interface _SearchByContentParams extends SearchByContentParams {
  results: MessageI[];
}

export const searchByContent = (
  params: SearchByContentParams
): ThunkAction<void, AppState, unknown, Action<_SearchByContentParams>> => {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.db.db)
      return console.warn("Tried to search before database was loaded");
    const db = state.db.db;
    db.searchPointsByContent(params.searchQuery).then(async (points) => {
      const results = await db.searchMessagesForPoints(points);

      dispatch(
        _searchByContent({
          ...params,
          results,
        })
      );
    });
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
