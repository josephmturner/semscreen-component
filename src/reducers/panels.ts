import { Action, Actions } from "../actions/constants";
import { PanelParams } from "../actions/panelsActions";

import { AppState } from "./store";

export interface PanelsState {
  bottom: boolean;
  right: boolean;
}

export const initialPanelsState: PanelsState = {
  bottom: false,
  right: false,
};

export const panelsReducer = (state: PanelsState, action: Action, appState: AppState): PanelsState => {
  let newState = state;
  switch (action.type) {
    case Actions.showPanel:
      newState = handleShowPanel(state, action as Action<PanelParams>);
      break;
    case Actions.hidePanel:
      newState = handleHidePanel(state, action as Action<PanelParams>);
      break;
  }
  return newState;
};

function handleShowPanel(state: PanelsState, action: Action<PanelParams>): PanelsState {
  return {
    ...state,
    [action.params.location]: true,
  };
}

function handleHidePanel(state: PanelsState, action: Action<PanelParams>): PanelsState {
  return {
    ...state,
    [action.params.location]: false,
  };
}
