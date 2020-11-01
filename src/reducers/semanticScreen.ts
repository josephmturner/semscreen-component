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
import { SetCurrentMessageParams } from "../actions/semanticScreenActions";
import { _MessageCreateParams } from "../actions/messagesActions";
import { containsPoints } from "../dataModels/pointUtils";

export interface SemanticScreenState {
  currentMessage: string;
}

export const initialSemanticScreenState = {
  currentMessage: "message0",
};

export const semanticScreenReducer = (
  state = initialSemanticScreenState,
  action: Action,
  appState: AppState
): SemanticScreenState => {
  let newState = state;
  switch (action.type) {
    case Actions.setCurrentMessage:
      newState = handleSetCurrentMessage(
        state,
        action as Action<SetCurrentMessageParams>
      );
      break;
    case Actions.messageCreate:
      newState = handleMessageCreate(
        state,
        action as Action<_MessageCreateParams>,
        appState
      );
      break;
  }
  return newState;
};

const handleSetCurrentMessage = (
  state: SemanticScreenState,
  action: Action<SetCurrentMessageParams>
) => {
  return {
    currentMessage: action.params.messageId,
  };
};

const handleMessageCreate = (
  state: SemanticScreenState,
  action: Action<_MessageCreateParams>,
  appState: AppState
) => {
  if (!containsPoints(state.currentMessage, appState)) return state;
  return {
    currentMessage: action.params.newMessageId,
  };
};
