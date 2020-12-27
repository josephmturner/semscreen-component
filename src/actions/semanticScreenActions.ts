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
import { ThunkAction } from "redux-thunk";

import { Action, Actions } from "./constants";
import { AppState } from "../reducers/store";
import {
  _getMessagesAndPoints,
  _populateMessageAndPoints,
  _PopulateMessageAndPointsParams,
} from "./dbActions";

export interface SetCurrentMessageParams {
  messageId: string;
  selectedPointIds?: string[];
}

export const setCurrentMessage = (
  params: SetCurrentMessageParams
): Action<SetCurrentMessageParams> => {
  return {
    type: Actions.setCurrentMessage,
    params,
  };
};

export interface ViewOriginalMessageParams {
  messageId: string;
  selectedPointIds?: string[];
}

export const viewOriginalMessage = (
  params: ViewOriginalMessageParams
): ThunkAction<
  void,
  AppState,
  unknown,
  Action<ViewOriginalMessageParams | _PopulateMessageAndPointsParams>
> => {
  return (dispatch, getState) => {
    (async () => {
      const state = getState();

      const { messageId, selectedPointIds } = params;

      if (!state.messages.allIds.includes(messageId)) {
        if (!state.db.db)
          return console.warn(
            "Tried to get message and points before database was loaded"
          );
        const db = state.db.db;

        try {
          const { messages, points } = await _getMessagesAndPoints(
            [messageId],
            db,
            state
          );

          dispatch(_populateMessageAndPoints({ messages, points }));
        } catch (e) {
          console.log(e);
        }
      }

      dispatch(setCurrentMessage({ messageId, selectedPointIds }));
    })();
  };
};
