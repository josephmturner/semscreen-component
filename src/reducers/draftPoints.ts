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
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import {
  _DraftPointCreateParams,
  DraftPointUpdateParams,
  _PointsMoveWithinMessageParams,
  _PointsMoveToMessageParams,
  _DraftPointsDeleteParams,
  _CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/draftPointsActions";
import { _DraftMessageDeleteParams } from "../actions/draftMessagesActions";
import { _PublishMessageParams } from "../actions/dbActions";

export interface DraftPointsState {
  byId: {
    [_id: string]: PointI | PointReferenceI;
  };
  allIds: string[];
}

export const initialDraftPointsState: DraftPointsState = {
  byId: {},
  allIds: [],
};

export const draftPointsReducer = (
  state = initialDraftPointsState,
  action: Action
): DraftPointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.draftPointCreate:
      newState = handleDraftPointCreate(
        state,
        action as Action<_DraftPointCreateParams>
      );
      break;
    case Actions.draftPointUpdate:
      newState = handleDraftPointUpdate(
        state,
        action as Action<DraftPointUpdateParams>
      );
      break;
    case Actions.pointsMoveWithinMessage:
      newState = handlePointsMoveWithinMessage(
        state,
        action as Action<_PointsMoveWithinMessageParams>
      );
      break;
    case Actions.pointsMoveToMessage:
      newState = handlePointsMoveToMessage(
        state,
        action as Action<_PointsMoveToMessageParams>
      );
      break;
    case Actions.draftPointsDelete:
      newState = handleDraftPointsDelete(
        state,
        action as Action<_DraftPointsDeleteParams>
      );
      break;
    case Actions.draftMessageDelete:
      newState = handleDraftMessageDelete(
        state,
        action as Action<_DraftMessageDeleteParams>
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<_CombinePointsParams>
      );
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<_SplitIntoTwoPointsParams>
      );
      break;
    case Actions.publishMessage:
      newState = handlePublishMessage(
        state,
        action as Action<_PublishMessageParams>
      );
      break;
  }
  return newState;
};

function handleDraftPointCreate(
  state: DraftPointsState,
  action: Action<_DraftPointCreateParams>
): DraftPointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.newPointId] = {
      ...action.params.point,
      _id: action.params.newPointId,
      pointDate: new Date(),
    };
    draft.allIds.push(action.params.newPointId);
  });
}

function handleDraftPointUpdate(
  state: DraftPointsState,
  action: Action<DraftPointUpdateParams>
): DraftPointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.point._id] = action.params.point;
  });
}

function handlePointsMoveWithinMessage(
  state: DraftPointsState,
  action: Action<_PointsMoveWithinMessageParams>
): DraftPointsState {
  return produce(state, (draft) => {
    const { region, pointIdsExcludingReferencePoints } = action.params;
    for (const id of pointIdsExcludingReferencePoints) {
      draft.byId[id] = {
        ...draft.byId[id],
        shape: region,
      };
    }
  });
}

function handlePointsMoveToMessage(
  state: DraftPointsState,
  action: Action<_PointsMoveToMessageParams>
): DraftPointsState {
  return produce(state, (draft) => {
    const { newDraftPoints } = action.params;
    if (newDraftPoints) {
      for (const point of newDraftPoints) {
        draft.byId[point._id] = point;
        draft.allIds.push(point._id);
      }
    }
  });
}

function handleDraftMessageDelete(
  state: DraftPointsState,
  action: Action<_DraftMessageDeleteParams>
): DraftPointsState {
  return produce(state, (draft) => {
    for (const id of action.params.pointIds) {
      delete draft.byId[id];
      draft.allIds = draft.allIds.filter((pId) => pId !== id);
    }
  });
}

function handleDraftPointsDelete(
  state: DraftPointsState,
  action: Action<_DraftPointsDeleteParams>
): DraftPointsState {
  return produce(state, (draft) => {
    action.params.pointIds.forEach((id) => {
      delete draft.byId[id];
      draft.allIds = draft.allIds.filter((pId) => pId !== id);
    });
  });
}

function handleCombinePoints(
  state: DraftPointsState,
  action: Action<_CombinePointsParams>
): DraftPointsState {
  return produce(state, (draft) => {
    const {
      pointToKeepId,
      keepIndex,
      pointToDeleteId,
      deleteIndex,
    } = action.params;

    const newContent =
      keepIndex < deleteIndex
        ? (state.byId[pointToKeepId] as PointI).content +
          (state.byId[pointToDeleteId] as PointI).content
        : (state.byId[pointToDeleteId] as PointI).content +
          (state.byId[pointToKeepId] as PointI).content;

    const pointToKeep = draft.byId[pointToKeepId];
    // Type assertion is okay here since pointToKeep will never be a
    // reference point
    (pointToKeep as PointI).content = newContent;
    delete draft.byId[pointToDeleteId];
    draft.allIds.filter((id) => id !== pointToDeleteId);
  });
}

function handleSplitIntoTwoPoints(
  state: DraftPointsState,
  action: Action<_SplitIntoTwoPointsParams>
): DraftPointsState {
  return produce(state, (draft) => {
    const { pointId, newPointId, shape, sliceIndex } = action.params;
    const topPoint = draft.byId[pointId] as PointI;

    const topContent = topPoint.content.slice(0, sliceIndex);
    const bottomContent = topPoint.content.slice(sliceIndex);

    topPoint.content = topContent;

    draft.byId[newPointId] = {
      content: bottomContent,
      _id: newPointId,
      shape: shape,
      pointDate: new Date(),
    };
    draft.allIds.push(newPointId);
  });
}

function handlePublishMessage(
  state: DraftPointsState,
  action: Action<_PublishMessageParams>
): DraftPointsState {
  return produce(state, (draft) => {
    for (const id in action.params.points) {
      delete draft.byId[id];
      draft.allIds = draft.allIds.filter((pId) => pId !== id);
    }
  });
}
