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
import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";
import { v4 as uuidv4 } from "uuid";

import { AppState } from "../reducers/store";
import {
  MessageI,
  PointI,
  PointReferenceI,
  UserIdentity,
} from "../dataModels/dataModels";
import {
  userIdentityLoad,
  UserIdentityCreateParams,
} from "./userIdentitiesActions";
import { displayApp, DisplayAppParams } from "./displayAppActions";
import {
  _draftMessageCreate,
  _draftMessageDelete,
  DraftMessageDeleteParams,
} from "./draftMessagesActions";

import leveljs from "level-js";
import { USHINBase } from "ushin-db";

import randomColor from "randomcolor";

export interface LoadDatabaseParams {
  db: USHINBase;
}

export const loadDatabase = (): ThunkAction<
  void,
  AppState,
  unknown,
  Action<LoadDatabaseParams | UserIdentityCreateParams | DisplayAppParams>
> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      if (!state.db.loading)
        return console.warn("Tried to load DB when already loaded");

      const leveldown = leveljs;
      const db = new USHINBase({ leveldown, authorURL: "author" });

      console.log("DB", db);
      await db.init();

      //For debugging
      (window as any).db = db;

      dispatch({
        type: Actions.loadDatabase,
        params: {
          db,
        },
      });

      //TODO: Add type guard isUserIdentity here
      let userIdentity = (await db.getAuthorInfo()) as UserIdentity;
      if (userIdentity.name === undefined || userIdentity.color === undefined) {
        await db.setAuthorInfo({
          ...userIdentity,
          name: "anonymous",
          color: randomColor(),
        });
        userIdentity = (await db.getAuthorInfo()) as UserIdentity;
      }
      dispatch(userIdentityLoad({ userIdentity }));

      //Load currentMessageId from a prior session...
      const rawLocalStorageState = localStorage.getItem("localStorageState");
      let localStorageState;
      if (rawLocalStorageState) {
        localStorageState = JSON.parse(rawLocalStorageState);
      }

      const currentMessageId = localStorageState.semanticScreen.currentMessage;
      if (currentMessageId !== undefined) {
        //Get currentMessage from ushin-db if it's a published message
        //(if it's a draft, the redux store already got it from localStorage)
        if (!state.draftMessages.allIds.includes(currentMessageId)) {
          const { messages, points } = await _getMessagesAndPoints(
            [currentMessageId],
            db
          );
          dispatch(_populateMessageAndPoints({ messages, points }));
        }
      } else {
        //If no currentMessageId exists in localStorage, create a new message
        const newMessageId = uuidv4();

        dispatch(_draftMessageCreate({ newMessageId }));
      }

      dispatch(displayApp({}));
    })();
  };
};

export interface PointMapping {
  [id: string]: PointI | PointReferenceI;
}

export interface SaveMessageParams {
  message: MessageI;
  points: PointMapping;
}

export const saveMessage = (
  params: SaveMessageParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_PopulateMessageAndPointsParams | DraftMessageDeleteParams>
> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      if (!state.db.db)
        return console.warn("Tried to save message before database was loaded");
      const db = state.db.db;

      try {
        const messageId = await db.addMessage(params.message, params.points);
        const { messages, points } = await _getMessagesAndPoints(
          [messageId],
          db
        );

        dispatch(_populateMessageAndPoints({ messages, points }));

        dispatch(_draftMessageDelete({ messageId }));
      } catch (e) {
        console.log(e);
      }
    })();
  };
};

export interface _PopulateMessageAndPointsParams {
  messages: MessageI[];
  points: PointMapping;
}

export const _populateMessageAndPoints = (
  params: _PopulateMessageAndPointsParams
): Action<_PopulateMessageAndPointsParams> => {
  return {
    type: Actions.populateMessageAndPoints,
    params,
  };
};

export const _getMessagesAndPoints = async (
  messageIds: string[],
  db: USHINBase
) => {
  const messages = await Promise.all(messageIds.map((id) => db.getMessage(id)));

  const arrayOfPointMappings: PointMapping[] = await Promise.all(
    messages.map((m) => db.getPointsForMessage(m))
  );

  const points: PointMapping = {};
  arrayOfPointMappings.forEach((pointMapping) =>
    Object.keys(pointMapping).forEach(
      (pointId) => (points[pointId] = pointMapping[pointId])
    )
  );

  return {
    messages,
    points,
  };
};
