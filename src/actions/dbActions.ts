import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";

import { AppState } from "../reducers/store";
import { MessageI, PointI, PointReferenceI } from "../dataModels/dataModels";

import memdown from "memdown";
import { USHINBase } from "ushin-db";

export interface MessageCreatedParams {
  messageId: string;
}

export interface DatabaseLoadedParams {
  db: USHINBase;
}

export interface PointMapping {
  [id: string]: PointI | PointReferenceI;
}

export const loadDatabase = (): ThunkAction<
  void,
  AppState,
  unknown,
  Action<DatabaseLoadedParams>
> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      if (!state.db.loading)
        return console.warn("Tried to load DB when already loaded");

      const leveldown = memdown;
      const db = new USHINBase({ leveldown, authorURL: "anonymous" });

      console.log("DB", db);
      await db.init();

      dispatch({
        type: Actions.loadDatabase,
        params: {
          db,
        },
      });
    })();
  };
};

export const saveMessage = (
  message: MessageI,
  points: PointMapping
): ThunkAction<void, AppState, unknown, Action<MessageCreatedParams>> => {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.db.db)
      return console.warn("Tried to save message before database was loaded");

    state.db.db
      .addMessage(message, points)
      .then((messageId: string) => {
        dispatch({
          type: Actions.saveMessage,
          params: {
            messageId,
          },
        });
      })
      .catch(console.error);
  };
};
