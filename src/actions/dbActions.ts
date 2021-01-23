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
import { Action, Actions } from "./constants";
import { ThunkAction } from "redux-thunk";
import { v4 as uuidv4 } from "uuid";

import { AppState } from "../reducers";
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
import { _draftMessageCreate } from "./draftMessagesActions";

import leveljs from "level-js";
import { USHINBase } from "ushin-db";

import randomColor from "randomcolor";

import { History } from "history";

export interface LoadDatabaseParams {
  history: History;
  pathname: string;
}

export interface _LoadDatabaseParams {
  db: USHINBase;
}

export const loadDatabase = (
  params: LoadDatabaseParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_LoadDatabaseParams | UserIdentityCreateParams | DisplayAppParams>
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

      // Hydrate all referenced points in draft messages
      const allDraftMessageIds = state.draftMessages.allIds;
      const allDraftMessages = allDraftMessageIds.map(
        (id) => state.draftMessages.byId[id]
      );
      const allReferencePointIds: Set<string> = new Set();
      for (const { shapes, main } of allDraftMessages) {
        const allDraftPointIds = Object.values(shapes).flat();
        if (main) {
          allDraftPointIds.push(main);
        }
        for (const pointId of allDraftPointIds) {
          const point = state.draftPoints.byId[pointId];
          if (isReference(point)) {
            for (const log of point.referenceHistory)
              allReferencePointIds.add(log.pointId);
          }
        }
      }
      const referencePoints: PointReferenceI[] = await Promise.all(
        Array.from(allReferencePointIds).map((id) => db.getPoint(id))
      );

      let points: PointMapping = {};
      for (const point of referencePoints) {
        points[point._id] = point;
      }

      dispatch(_populateMessageAndPoints({ points }));

      const priorPathname = localStorage.getItem("pathname");

      if (params.pathname === "/") {
        //Restore prior pathname if no pathname has been entered
        if (priorPathname !== null && priorPathname !== "/") {
          params.history.push(priorPathname);
        } else {
          //If no prior pathname exists, create a new message
          const newMessageId = uuidv4();
          dispatch(_draftMessageCreate({ newMessageId }));
          params.history.push(`/u/${userIdentity._id}/d/${newMessageId}`);
        }
      }

      dispatch(displayApp({}));
    })();
  };
};

export interface LoadMessageParams {
  messageId: string;
}

export const loadMessage = (
  params: LoadMessageParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<_PopulateMessageAndPointsParams>
> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      if (!state.db.db)
        return console.warn(
          "Tried to load message and author before database was loaded"
        );
      const db = state.db.db;

      try {
        const { messages, points } = await _getMessagesAndPoints(
          [params.messageId],
          db,
          state
        );
        dispatch(_populateMessageAndPoints({ messages, points }));
      } catch (e) {
        console.error(e);
      }
    })();
  };
};

export interface PointMapping {
  [id: string]: PointI | PointReferenceI;
}

export interface PublishMessageParams {
  messageId: string;
  history: History;
}

export const publishMessage = (
  params: PublishMessageParams
): ThunkAction<void, AppState, unknown, Action<_PublishMessageParams>> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      if (!state.db.db)
        return console.warn(
          "Tried to publish message before database was loaded"
        );
      const db = state.db.db;

      const { messageId: _messageId } = params;
      const _message = state.draftMessages.byId[_messageId];
      const _points = state.draftPoints.byId;

      try {
        const messageId = await db.addMessage(_message, _points);
        const { messages, points } = await _getMessagesAndPoints(
          [messageId],
          db,
          state
        );
        dispatch(_publishMessage({ messages, points }));

        const { currentIdentity } = state.userIdentities;
        params.history.push(`/u/${currentIdentity}/m/${messageId}`);
      } catch (e) {
        console.error(e);
      }
    })();
  };
};

export interface _PublishMessageParams {
  messages: MessageI[];
  points: PointMapping;
}

const _publishMessage = (
  params: _PublishMessageParams
): Action<_PublishMessageParams> => {
  return {
    type: Actions.publishMessage,
    params,
  };
};

export interface _PopulateMessageAndPointsParams {
  messages?: MessageI[];
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
