import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";

import { AppState } from "../reducers/store";
import { MessageI, PointI } from "../dataModels/dataModels";

export interface SearchResultParams {
  results: MessageI[];
  search: string;
}

export const searchByContent = (
  search: string
): ThunkAction<void, AppState, unknown, Action<SearchResultParams>> => {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.db.db)
      return console.warn("Tried to search before database was loaded");
    const db = state.db.db;
    db.searchPointsByContent(search).then(async (points) => {
      const results = await db.searchMessagesForPoints(points);

      dispatch({
        type: Actions.searchResults,
        params: { search, results },
      });
    });
  };
};
