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

export const panelsReducer = (
  state: PanelsState,
  action: Action,
  appState: AppState
): PanelsState => {
  let newState = state;
  switch (action.type) {
    case Actions.togglePanel:
      newState = handleTogglePanel(state, action as Action<PanelParams>);
      break;
  }
  return newState;
};

function handleTogglePanel(
  state: PanelsState,
  action: Action<PanelParams>
): PanelsState {
  return {
    ...state,
    [action.params.location]: !state[action.params.location],
  };
}
