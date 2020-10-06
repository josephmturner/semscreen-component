import { Action, Actions } from "../actions/constants";
import { ExpandedRegionParams } from "../actions/expandedRegionActions";

import { AppState } from "./store";

export interface ExpandedRegionState {
  region: string;
}

export const initialExpandedRegionState: ExpandedRegionState = {
  region: "",
};

export const expandedRegionReducer = (
  state = initialExpandedRegionState,
  action: Action,
  appState: AppState
): ExpandedRegionState => {
  let newState = state;
  switch (action.type) {
    case Actions.setExpandedRegion:
      newState = handleSetExpandedRegion(
        state,
        action as Action<ExpandedRegionParams>
      );
      break;
  }
  return newState;
};

function handleSetExpandedRegion(
  state: ExpandedRegionState,
  action: Action<ExpandedRegionParams>
): ExpandedRegionState {
  let newState = state;
  if (state.region === action.params.region) {
    newState = { region: "" };
  } else {
    newState = { region: action.params.region };
  }
  return newState;
}
