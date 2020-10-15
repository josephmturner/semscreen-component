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
import produce from "immer";
import { PointI } from "../dataModels";
import { AppState } from "./store";
import {
  _PointCreateParams,
  PointUpdateParams,
  PointMoveParams,
  PointsDeleteParams,
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/pointsActions";
import { SetFocusParams } from "../actions/messageActions";

export interface PointsState {
  byId: {
    [_id: string]: PointI;
  };
}

export const initialPointsState: PointsState = { byId: {} };

export const pointsReducer = (
  state: PointsState,
  action: Action,
  appState: AppState
): PointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.pointCreate:
      newState = handlePointCreate(state, action as Action<_PointCreateParams>);
      break;
    case Actions.pointUpdate:
      newState = handlePointUpdate(state, action as Action<PointUpdateParams>);
      break;
    case Actions.pointMove:
      newState = handlePointMove(state, action as Action<PointMoveParams>);
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
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<_SplitIntoTwoPointsParams>
      );
      break;
    case Actions.setFocus:
      newState = handleSetFocus(state, action as Action<SetFocusParams>);
      break;
  }
  return newState;
};

function handlePointCreate(
  state: PointsState,
  action: Action<_PointCreateParams>
): PointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.newPointId] = {
      ...action.params.point,
      _id: action.params.newPointId,
      pointDate: new Date(),
    };
  });
}

function handlePointUpdate(
  state: PointsState,
  action: Action<PointUpdateParams>
): PointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.point._id] = action.params.point;
  });
}

function handlePointMove(
  state: PointsState,
  action: Action<PointMoveParams>
): PointsState {
  if (state.byId[action.params.pointId].shape === action.params.newShape)
    return state;
  return produce(state, (draft) => {
    draft.byId[action.params.pointId] = {
      ...state.byId[action.params.pointId],
      shape: action.params.newShape,
    };
  });
}

function handlePointsDelete(
  state: PointsState,
  action: Action<PointsDeleteParams>
): PointsState {
  return produce(state, (draft) => {
    action.params.pointIds.forEach((id) => delete draft.byId[id]);
  });
}

//TODO: reuse withinBounds and isQuoted logic in src/reducers/message
//Is it good form to access appState in src/actions/pointsActions?
//note: in src/reducers/message, state must be replaced with
//appState.points (and a similar change in this file)
function handleCombinePoints(
  state: PointsState,
  action: Action<CombinePointsParams>,
  appState: AppState
): PointsState {
  const withinBounds = (index: number): boolean => {
    return (
      index >= 0 && index < appState.message.shapes[action.params.shape].length
    );
  };

  const isQuoted = (index: number): boolean => {
    const pointId = appState.message.shapes[action.params.shape][index];
    return !!state.byId[pointId].quotedAuthor;
  };

  // Don't attempt to combine a point with the point below it if no point
  // exists below it.
  if (
    !withinBounds(action.params.keepIndex) ||
    !withinBounds(action.params.deleteIndex)
  ) {
    return state;
  }

  // Don't combine points with quoted points:
  if (
    isQuoted(action.params.keepIndex) ||
    isQuoted(action.params.deleteIndex)
  ) {
    return state;
  }

  const pointIdToKeep =
    appState.message.shapes[action.params.shape][action.params.keepIndex];
  const pointIdToDelete =
    appState.message.shapes[action.params.shape][action.params.deleteIndex];

  const newContent =
    action.params.keepIndex < action.params.deleteIndex
      ? state.byId[pointIdToKeep].content + state.byId[pointIdToDelete].content
      : state.byId[pointIdToDelete].content + state.byId[pointIdToKeep].content;
  return produce(state, (draft) => {
    delete draft.byId[pointIdToDelete];
    draft.byId[pointIdToKeep].content = newContent;
  });
}

function handleSplitIntoTwoPoints(
  state: PointsState,
  action: Action<_SplitIntoTwoPointsParams>
): PointsState {
  const topContent = state.byId[action.params.pointId].content.slice(
    0,
    action.params.sliceIndex
  );
  const bottomContent = state.byId[action.params.pointId].content.slice(
    action.params.sliceIndex
  );

  return produce(state, (draft) => {
    draft.byId[action.params.pointId].content = topContent;
    draft.byId[action.params.newPointId] = {
      content: bottomContent,
      _id: action.params.newPointId,
      shape: state.byId[action.params.pointId].shape,
      pointDate: new Date(),
    };
  });
}

function handleSetFocus(
  state: PointsState,
  action: Action<SetFocusParams>
): PointsState {
  return produce(state, (draft) => {
    //Ensures that points retain their original shape when set to
    //focus even if they've been dragged through another region
    draft.byId[action.params.pointId].shape = action.params.originalShape;
  });
}
