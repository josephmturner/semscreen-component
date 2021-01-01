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

export const dragReducer = (state: DragState, action: Action): DragState => {
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
