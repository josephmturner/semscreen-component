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
import { ExpandedRegionParams } from "../actions/expandedRegionActions";

import { AppState } from "./store";

import { RegionI } from "../dataModels/dataModels";

export interface ExpandedRegionState {
  region: RegionI | "";
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
