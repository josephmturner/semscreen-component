/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import { Action, Actions } from "../actions/constants";

import { HoverOverParams, EndDragParams } from "../actions/dragActions";

interface DragContext {
  index: number;
  region: string;
}

export interface DragState {
  context: DragContext | null;
}

export const initialDragState: DragState = {
  context: null,
};

export const dragReducer = (
  state = initialDragState,
  action: Action
): DragState => {
  let newState = state;
  switch (action.type) {
    case Actions.hoverOver:
      newState = handleHoverOver(state, action as Action<HoverOverParams>);
      break;
    case Actions.endDrag:
      newState = handleEndDrag(state, action as Action<EndDragParams>);
      break;
  }

  return newState;
};

function handleHoverOver(
  state: DragState,
  action: Action<HoverOverParams>
): DragState {
  return {
    context: {
      index: action.params.index,
      region: action.params.region,
    },
  };
}

function handleEndDrag(
  state: DragState,
  action: Action<EndDragParams>
): DragState {
  return {
    context: null,
  };
}
