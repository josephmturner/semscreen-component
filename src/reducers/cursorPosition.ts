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
import { _CursorPositionParams } from "../actions/cursorPositionActions";
import { _CombinePointsParams } from "../actions/draftPointsActions";

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
  action: Action
): CursorPositionState => {
  let newState = state;
  switch (action.type) {
    case Actions.setCursorPosition:
      newState = handleSetCursorPosition(
        state,
        action as Action<_CursorPositionParams>
      );
      break;
    case Actions.clearCursorPosition:
      newState = handleClearCursorPosition(state, action);
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<_CombinePointsParams>
      );
      break;
  }
  return newState;
};

function handleSetCursorPosition(
  state: CursorPositionState,
  action: Action<_CursorPositionParams>
): CursorPositionState {
  return produce(state, (draft) => {
    const { nextId, prevPoint } = action.params;

    if (action.params.moveTo === "endOfPrevPoint" && prevPoint) {
      draft.details = {
        pointId: prevPoint._id,
        contentIndex: prevPoint.content.length,
      };
    } else if (action.params.moveTo === "beginningOfNextPoint") {
      draft.details = {
        pointId: nextId,
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
  action: Action<_CombinePointsParams>
): CursorPositionState {
  return produce(state, (draft) => {
    const { pointToKeep } = action.params;

    draft.details = {
      pointId: pointToKeep._id,
      contentIndex: pointToKeep.content.length,
    };
  });
}
