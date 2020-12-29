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
import { getPointIfReference, getMessageById } from "../dataModels/pointUtils";
import { Action, Actions } from "../actions/constants";
import { CursorPositionParams } from "../actions/cursorPositionActions";
import { CombinePointsParams } from "../actions/draftPointsActions";

import { AppState } from "./store";

export interface Details {
  pointId: string;
  contentIndex: number;
}

export interface CursorPositionState {
  details?: Details;
}

export const initialCursorPositionState: CursorPositionState = {};

export const cursorPositionReducer = (
  state = initialCursorPositionState,
  action: Action,
  appState: AppState
): CursorPositionState => {
  let newState = state;
  switch (action.type) {
    case Actions.setCursorPosition:
      newState = handleSetCursorPosition(
        state,
        action as Action<CursorPositionParams>,
        appState
      );
      break;
    case Actions.clearCursorPosition:
      newState = handleClearCursorPosition(state, action);
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<CombinePointsParams>,
        appState
      );
      break;
  }
  return newState;
};

function handleSetCursorPosition(
  state: CursorPositionState,
  action: Action<CursorPositionParams>,
  appState: AppState
): CursorPositionState {
  return produce(state, (draft) => {
    const pointId = action.params.pointId;
    const { shape } = getPointIfReference(pointId, appState);
    const currentMessageId = appState.semanticScreen.currentMessage as string;
    const currentMessage = getMessageById(currentMessageId, appState);
    const pointIds = currentMessage.shapes[shape];
    const index = pointIds.findIndex((id) => id === pointId);
    const prev = pointIds[index - 1];
    const next = pointIds[index + 1];

    if (action.params.moveTo === "endOfPriorPoint" && index !== 0) {
      draft.details = {
        pointId: prev,
        contentIndex: getPointIfReference(prev, appState).content.length,
      };
    } else if (
      action.params.moveTo === "beginningOfNextPoint" &&
      index !== pointIds.length - 1
    ) {
      draft.details = {
        pointId: next,
        contentIndex: 0,
      };
    }
  });
}

function handleClearCursorPosition(
  state: CursorPositionState,
  action: Action
): CursorPositionState {
  return produce(state, (draft) => {
    delete draft.details;
  });
}

function handleCombinePoints(
  state: CursorPositionState,
  action: Action<CombinePointsParams>,
  appState: AppState
): CursorPositionState {
  const smallerIndex = Math.min(
    action.params.keepIndex,
    action.params.deleteIndex
  );

  const currentMessageId = appState.semanticScreen.currentMessage as string;
  const currentMessage = appState.draftMessages.byId[currentMessageId];
  const prevPointId = currentMessage.shapes[action.params.shape][smallerIndex];
  const prevPoint = getPointIfReference(prevPointId, appState);

  const newCursorPosition = {
    pointId:
      currentMessage.shapes[action.params.shape][action.params.keepIndex],
    contentIndex: prevPoint.content.length,
  };

  return {
    details: newCursorPosition,
  };
}
