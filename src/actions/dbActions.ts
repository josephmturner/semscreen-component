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
import { isReference } from "../dataModels/pointUtils";
import {
  userIdentityLoad,
  UserIdentityCreateParams,
} from "./userIdentitiesActions";
import { displayApp, DisplayAppParams } from "./displayAppActions";
import {
  _draftMessageCreate,
  _draftMessageDelete,
  _DraftMessageDeleteParams,
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

      //Load currentMessageId from a prior session from localStorage...
      const rawLocalStorageState = localStorage.getItem("localStorageState");
      let localStorageState;
      if (rawLocalStorageState) {
        localStorageState = JSON.parse(rawLocalStorageState);
      }

      const currentMessageId = localStorageState.semanticScreen.currentMessage;
      if (currentMessageId !== undefined) {
        let messages: MessageI[] = [];
        let points: PointMapping = {};

        if (!state.draftMessages.allIds.includes(currentMessageId)) {
          //If the currentMessageId corresponds to a published message, get it from ushin-db
          const current = await _getMessagesAndPoints(
            [currentMessageId],
            db,
            state
          );
          messages = current.messages;
          points = current.points;
        }
        //If any draftPoints are quoted points, load the quotes

        const draftPoints = Object.values(state.draftPoints.byId);
        const referencePointIds: Set<string> = new Set();
        for (const point of draftPoints) {
          if (isReference(point)) {
            for (const log of point.referenceHistory)
              referencePointIds.add(log.pointId);
          }
        }

        const referencePoints: PointReferenceI[] = await Promise.all(
          Array.from(referencePointIds).map((id) => db.getPoint(id))
        );

        for (const point of referencePoints) {
          points[point._id] = point;
        }

        dispatch(_populateMessageAndPoints({ messages, points }));
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
  Action<_PopulateMessageAndPointsParams | _DraftMessageDeleteParams>
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
          db,
          state
        );

        dispatch(_populateMessageAndPoints({ messages, points }));

        const currentMessageId = state.semanticScreen.currentMessage as string;
        dispatch(_draftMessageDelete({ messageId, currentMessageId }));
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
  db: USHINBase,
  state: AppState
) => {
  const dedupedMessageIds = messageIds.filter(
    (id) => !state.messages.allIds.includes(id)
  );

  const messages = await Promise.all(
    dedupedMessageIds.map((id) => db.getMessage(id))
  );

  const arrayOfPointMappings: PointMapping[] = await Promise.all(
    messages.map((m) => db.getPointsForMessage(m, state.points.byId))
  );

  let points: PointMapping = {};
  for (const pointMapping of arrayOfPointMappings) {
    points = { ...points, ...pointMapping };
  }

  return {
    messages,
    points,
  };
};
