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
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import {
  _PopulateMessageAndPointsParams,
  _PublishMessageParams,
} from "../actions/dbActions";

import produce from "immer";

export interface PointsState {
  byId: {
    [_id: string]: PointI | PointReferenceI;
  };
  allIds: string[];
}

export const initialPointsState: PointsState = { byId: {}, allIds: [] };

export const pointsReducer = (
  state = initialPointsState,
  action: Action
): PointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.populateMessageAndPoints:
      newState = handlePopulateMessageAndPoints(
        state,
        action as Action<_PopulateMessageAndPointsParams>
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

function handlePopulateMessageAndPoints(
  state: PointsState,
  action: Action<_PopulateMessageAndPointsParams>
) {
  return produce(state, (draft) => {
    draft.byId = { ...draft.byId, ...action.params.points };
    for (const id in action.params.points) {
      draft.allIds.push(id);
    }
  });
}

function handlePublishMessage(
  state: PointsState,
  action: Action<_PublishMessageParams>
): PointsState {
  return produce(state, (draft) => {
    draft.byId = { ...draft.byId, ...action.params.points };
    for (const id in action.params.points) {
      draft.allIds.push(id);
    }
  });
}
