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

import { getPointIfReference, getMessageById } from "../dataModels/pointUtils";
import { Action, Actions } from "./constants";
import { PointI } from "../dataModels/dataModels";
import { AppState } from "../reducers/store";

export interface CursorPositionParams {
  point: PointI;
  index: number;
  moveTo: "endOfPrevPoint" | "beginningOfNextPoint";
}

export interface _CursorPositionParams
  extends Omit<CursorPositionParams, "point" | "index"> {
  nextId: string;
  prevPoint?: PointI;
}

export const setCursorPosition = (
  params: CursorPositionParams
): ThunkAction<void, AppState, unknown, Action<_CursorPositionParams>> => {
  return (dispatch, getState) => {
    const state = getState();

    const { point, index, moveTo } = params;
    const { shape } = point;

    const currentMessageId = state.semanticScreen.currentMessage as string;
    const currentMessage = getMessageById(currentMessageId, state);
    const currentPointIds = currentMessage.shapes[shape];

    // Don't try to move the cursor to a point which doesn't exist
    if (
      (moveTo === "endOfPrevPoint" && index === 0) ||
      (moveTo === "beginningOfNextPoint" && index === currentPointIds.length)
    ) {
      return;
    }

    const nextId = currentPointIds[index + 1];
    const prevId = currentPointIds[index - 1];
    let prevPoint: PointI | undefined;
    if (moveTo === "endOfPrevPoint") {
      prevPoint = getPointIfReference(prevId, state);
    }

    dispatch({
      type: Actions.setCursorPosition,
      params: {
        ...params,
        nextId,
        prevPoint,
      },
    });
  };
};

export const clearCursorPosition = (): Action => {
  return {
    type: Actions.clearCursorPosition,
    params: {},
  };
};
