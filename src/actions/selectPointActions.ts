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
import { ThunkAction } from "redux-thunk";
import { History } from "history";
import { AppState } from "../reducers";
import { Action, Actions } from "./constants";
import { getReferencedPointId } from "../dataModels/pointUtils";

export interface SetSelectedPointsParams {
  pointIds: string[];
}

export const setSelectedPoints = (
  params: SetSelectedPointsParams
): Action<SetSelectedPointsParams> => {
  return {
    type: Actions.setSelectedPoints,
    params,
  };
};

export interface TogglePointParams {
  pointId: string;
}

export const togglePoint = (
  params: TogglePointParams
): Action<TogglePointParams> => {
  return {
    type: Actions.togglePoint,
    params,
  };
};

export interface ViewOriginalMessageParams {
  pointId: string;
}

export const viewOriginalMessage = (
  params: ViewOriginalMessageParams
): ThunkAction<void, AppState, unknown, Action<SetSelectedPointsParams>> => {
  return (dispatch, getState) => {
    const appState = getState();
    // Type assertion is okay here since viewOriginalMessage only fires on
    // quoted points
    const referencedPointId = getReferencedPointId(
      params.pointId,
      appState
    ) as string;
    dispatch(setSelectedPoints({ pointIds: [referencedPointId] }));
  };
};

export interface SetCurrentMessageParams {
  oldMessageId: string;
  newAuthorId: string;
  newMessageId: string;
  history: History;
  oldMessageIsDraft: boolean;
}

export interface _SetCurrentMessageParams {
  oldMessageId: string;
}

export const setCurrentMessage = (
  params: SetCurrentMessageParams
): Action<_SetCurrentMessageParams> => {
  const {
    oldMessageId,
    newAuthorId,
    newMessageId,
    oldMessageIsDraft,
    history,
  } = params;

  if (oldMessageIsDraft === true) {
    history.push(`/u/${newAuthorId}/d/${newMessageId}`);
  } else {
    history.push(`/u/${newAuthorId}/m/${newMessageId}`);
  }
  return {
    type: Actions.setCurrentMessage,
    params: { oldMessageId },
  };
};
