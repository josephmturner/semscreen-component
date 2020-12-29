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
import {
  SetSelectedPointsParams,
  TogglePointParams,
} from "../actions/selectPointActions";
import {
  _CombinePointsParams,
  DraftPointsDeleteParams,
  _PointsMoveToMessageParams,
} from "../actions/draftPointsActions";
import { SetCurrentMessageParams } from "../actions/semanticScreenActions";
import {
  _DraftMessageCreateParams,
  DraftMessageDeleteParams,
} from "../actions/draftMessagesActions";

export interface SelectedPointsState {
  pointIds: string[];
}

export const initialSelectedPointsState: SelectedPointsState = {
  pointIds: [],
};

export const selectedPointsReducer = (
  state = initialSelectedPointsState,
  action: Action,
  appState: AppState
): SelectedPointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.setSelectedPoints:
      newState = handleSetSelectedPoints(
        state,
        action as Action<SetSelectedPointsParams>
      );
      break;
    case Actions.togglePoint:
      newState = handleTogglePoint(state, action as Action<TogglePointParams>);
      break;
    case Actions.draftPointsDelete:
      newState = handleDraftPointsDelete(
        state,
        action as Action<DraftPointsDeleteParams>
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<_CombinePointsParams>
      );
      break;
    case Actions.setCurrentMessage:
      newState = handleSetCurrentMessage(
        state,
        action as Action<SetCurrentMessageParams>
      );
      break;
    case Actions.draftMessageCreate:
      newState = handleDraftMessageCreate(
        state,
        action as Action<_DraftMessageCreateParams>
      );
      break;
    case Actions.draftMessageDelete:
      newState = handleDraftMessageDelete(
        state,
        action as Action<DraftMessageDeleteParams>,
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

function handleSetSelectedPoints(
  state: SelectedPointsState,
  action: Action<SetSelectedPointsParams>
): SelectedPointsState {
  return {
    pointIds: action.params.pointIds,
  };
}

function handleTogglePoint(
  state: SelectedPointsState,
  action: Action<TogglePointParams>
): SelectedPointsState {
  const newPointIds = state.pointIds.filter(
    (pointId) => pointId !== action.params.pointId
  );
  if (newPointIds.length === state.pointIds.length) {
    newPointIds.push(action.params.pointId);
  }
  return {
    pointIds: newPointIds,
  };
}

function handleDraftPointsDelete(
  state: SelectedPointsState,
  action: Action<DraftPointsDeleteParams>
): SelectedPointsState {
  return action.params.deleteSelectedPoints ? { pointIds: [] } : state;
}

function handleCombinePoints(
  state: SelectedPointsState,
  action: Action<_CombinePointsParams>
): SelectedPointsState {
  return produce(state, (draft) => {
    draft.pointIds = draft.pointIds.filter(
      (id) => id !== action.params.pointIdToDelete
    );
  });
}

function handleSetCurrentMessage(
  state: SelectedPointsState,
  action: Action<SetCurrentMessageParams>
): SelectedPointsState {
  const pointIds = action.params.selectedPointIds ?? [];
  return {
    pointIds,
  };
}

function handleDraftMessageCreate(
  state: SelectedPointsState,
  action: Action<_DraftMessageCreateParams>
): SelectedPointsState {
  const pointIds = action.params.newReferencePoints
    ? action.params.newReferencePoints.map((p) => p._id)
    : state.pointIds;
  return {
    pointIds,
  };
}

function handleDraftMessageDelete(
  state: SelectedPointsState,
  action: Action<DraftMessageDeleteParams>,
  appState: AppState
) {
  return produce(state, (draft) => {
    if (appState.semanticScreen.currentMessage === action.params.messageId) {
      draft.pointIds = [];
    }
  });
}

function handlePointsMove(
  state: SelectedPointsState,
  action: Action<_PointsMoveToMessageParams>
): SelectedPointsState {
  const pointIds = action.params.newReferencePoints
    ? action.params.newReferencePoints.map((p) => p._id)
    : state.pointIds;
  return {
    pointIds,
  };
}
