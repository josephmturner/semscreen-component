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
import { AppState } from "./store";

import { MessageI } from "../dataModels/dataModels";
import { SaveMessageParams } from "../actions/dbActions";

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
  action: Action,
  appState: AppState
): MessagesState => {
  let newState = state;
  switch (action.type) {
    case Actions.saveMessage:
      newState = handleSaveMessage(state, action as Action<SaveMessageParams>);
      break;
  }
  return newState;
};

const handleSaveMessage = (
  state: MessagesState,
  action: Action<SaveMessageParams>
): MessagesState => {
  return produce(state, (draft) => {
    draft.byId[action.params.message._id] = action.params.message;
    draft.allIds.push(action.params.message._id);
  });
};
