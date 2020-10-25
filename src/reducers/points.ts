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
import {
  PointI,
  PointReferenceI,
  isPointShape,
} from "../dataModels/dataModels";
import {
  getPointById,
  getReferenceData,
  getReferencedPointId,
} from "../dataModels/getters";
import { AppState } from "./store";
import {
  _PointCreateParams,
  PointUpdateParams,
  PointsMoveParams,
  PointsDeleteParams,
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/pointsActions";

export interface PointsState {
  byId: {
    [_id: string]: PointI | PointReferenceI;
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
    case Actions.pointsMove:
      newState = handlePointsMove(
        state,
        action as Action<PointsMoveParams>,
        appState
      );
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

function handlePointsMove(
  state: PointsState,
  action: Action<PointsMoveParams>,
  appState: AppState
): PointsState {
  if (appState.drag.context === null) return state;
  const { region } = appState.drag.context;

  if (!isPointShape(region)) return state;
  const pointIdsExcludingReferencePoints = appState.selectedPoints.pointIds.filter(
    (p) => !getReferenceData(p, state)
  );
  return produce(state, (draft) => {
    pointIdsExcludingReferencePoints.forEach(
      (id) =>
        (draft.byId[id] = {
          ...draft.byId[id],
          shape: region,
        })
    );
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
  const currentMessage =
    appState.messages.byId[appState.semanticScreen.currentMessage];
  const withinBounds = (index: number): boolean => {
    return (
      index >= 0 && index < currentMessage.shapes[action.params.shape].length
    );
  };

  const isQuoted = (index: number): boolean => {
    const pointId = currentMessage.shapes[action.params.shape][index];
    return !!getReferencedPointId(pointId, state);
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
    currentMessage.shapes[action.params.shape][action.params.keepIndex];
  const pointIdToDelete =
    currentMessage.shapes[action.params.shape][action.params.deleteIndex];

  const newContent =
    action.params.keepIndex < action.params.deleteIndex
      ? getPointById(pointIdToKeep, state).content +
        getPointById(pointIdToDelete, state).content
      : getPointById(pointIdToDelete, state).content +
        getPointById(pointIdToKeep, state).content;
  return produce(state, (draft) => {
    delete draft.byId[pointIdToDelete];
    getPointById(pointIdToKeep, draft).content = newContent;
  });
}

function handleSplitIntoTwoPoints(
  state: PointsState,
  action: Action<_SplitIntoTwoPointsParams>
): PointsState {
  const topContent = getPointById(action.params.pointId, state).content.slice(
    0,
    action.params.sliceIndex
  );
  const bottomContent = getPointById(
    action.params.pointId,
    state
  ).content.slice(action.params.sliceIndex);

  return produce(state, (draft) => {
    getPointById(action.params.pointId, draft).content = topContent;
    draft.byId[action.params.newPointId] = {
      content: bottomContent,
      _id: action.params.newPointId,
      shape: getPointById(action.params.pointId, draft).shape,
      pointDate: new Date(),
    };
  });
}
