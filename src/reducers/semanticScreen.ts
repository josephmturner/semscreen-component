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
import produce from "immer";

import { Action, Actions } from "../actions/constants";
import { AppState } from "./store";
import { SetCurrentMessageParams } from "../actions/semanticScreenActions";
import { _PointsMoveToMessageParams } from "../actions/draftPointsActions";
import {
  _MessageCreateParams,
  _MessageDeleteParams,
} from "../actions/draftMessagesActions";
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
    case Actions.messageDelete:
      newState = handleMessageDelete(
        state,
        action as Action<_MessageDeleteParams>,
        appState
      );
      break;
    case Actions.pointsMoveToMessage:
      newState = handlePointsMove(
        state,
        action as Action<_PointsMoveToMessageParams>
      );
      break;
  }
  return newState;
};

function handleSetCurrentMessage(
  state: SemanticScreenState,
  action: Action<SetCurrentMessageParams>
) {
  return {
    currentMessage: action.params.messageId,
  };
}

function handleMessageCreate(
  state: SemanticScreenState,
  action: Action<_MessageCreateParams>,
  appState: AppState
) {
  if (!containsPoints(state.currentMessage, appState)) return state;
  return {
    currentMessage: action.params.newMessageId,
  };
}

function handleMessageDelete(
  state: SemanticScreenState,
  action: Action<_MessageDeleteParams>,
  appState: AppState
) {
  // Only switch messages if the current message is deleted
  if (state.currentMessage !== action.params.messageId) {
    return state;
  }

  return produce(state, (draft) => {
    const remainingDraftMessages = appState.draftMessages.allIds.filter(
      (id) => id !== action.params.messageId
    );
    // Switch to the next message in the list of drafts...
    if (action.params.newMessageId === undefined) {
      draft.currentMessage = remainingDraftMessages[0];
    } else {
      // If none exist, switch to the newly created message
      draft.currentMessage = action.params.newMessageId;
    }
  });
}

function handlePointsMove(
  state: SemanticScreenState,
  action: Action<_PointsMoveToMessageParams>
): SemanticScreenState {
  const messageId = action.params.messageId
    ? action.params.messageId
    : state.currentMessage;

  return {
    currentMessage: messageId,
  };
}
