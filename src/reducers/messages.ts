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
import { Action, Actions } from "../actions/constants";
import { MessageI } from "../dataModels/dataModels";
import { _PopulateMessageAndPointsParams } from "../actions/dbActions";

import produce from "immer";

export interface MessagesState {
  byId: {
    [_id: string]: MessageI;
  };
  allIds: string[];
}

export const initialMessagesState: MessagesState = {
  byId: {},
  allIds: [],
};

export const messagesReducer = (
  state = initialMessagesState,
  action: Action
): MessagesState => {
  let newState = state;
  switch (action.type) {
    case Actions.populateMessageAndPoints:
      newState = handlePopulateMessageAndPoints(
        state,
        action as Action<_PopulateMessageAndPointsParams>
      );
      break;
  }
  return newState;
};

const handlePopulateMessageAndPoints = (
  state: MessagesState,
  action: Action<_PopulateMessageAndPointsParams>
): MessagesState => {
  return produce(state, (draft) => {
    if (action.params.messages) {
      for (const message of action.params.messages) {
        draft.byId[message._id] = message;
        draft.allIds.push(message._id);
      }
    }
  });
};
