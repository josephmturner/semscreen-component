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
import {
  SetSelectedPointsParams,
  TogglePointParams,
} from "../actions/selectPointActions";
import {
  CombinePointsParams,
  PointsDeleteParams,
} from "../actions/pointsActions";
import { SetCurrentMessageParams } from "../actions/semanticScreenActions";
import { _MessageCreateParams } from "../actions/messagesActions";
import { AppState } from "./store";

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
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<CombinePointsParams>,
        appState
      );
      break;
    case Actions.setCurrentMessage:
      newState = handleSetCurrentMessage(
        state,
        action as Action<SetCurrentMessageParams>
      );
      break;
    case Actions.messageCreate:
      newState = handleMessageCreate(
        state,
        action as Action<_MessageCreateParams>
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

function handlePointsDelete(
  state: SelectedPointsState,
  action: Action<PointsDeleteParams>
): SelectedPointsState {
  const newPointIds = state.pointIds.filter((pointId) => {
    return !action.params.pointIds.includes(pointId);
  });
  return {
    pointIds: newPointIds,
  };
}

function handleCombinePoints(
  state: SelectedPointsState,
  action: Action<CombinePointsParams>,
  appState: AppState
): SelectedPointsState {
  const currentMessage =
    appState.messages.byId[appState.semanticScreen.currentMessage];
  const deletedPointId =
    currentMessage.shapes[action.params.shape][action.params.deleteIndex];
  return {
    pointIds: state.pointIds.filter((id) => id !== deletedPointId),
  };
}

function handleSetCurrentMessage(
  state: SelectedPointsState,
  action: Action<SetCurrentMessageParams>
): SelectedPointsState {
  return {
    pointIds: [],
  };
}

function handleMessageCreate(
  state: SelectedPointsState,
  action: Action<_MessageCreateParams>,
): SelectedPointsState {
  const pointIds = action.params.pointIds ? [] : state.pointIds;
  return {
    pointIds,
  };
}
