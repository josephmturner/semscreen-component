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
import { DisplayAppParams } from "../actions/displayAppActions";

import produce from "immer";

export interface DisplayAppState {
  display: boolean;
}

export const initialDisplayAppState: DisplayAppState = {
  display: false,
};

export const displayAppReducer = (
  state = initialDisplayAppState,
  action: Action
): DisplayAppState => {
  let newState = state;
  switch (action.type) {
    case Actions.displayApp:
      newState = handleDisplayApp(state, action as Action<DisplayAppParams>);
      break;
  }
  return newState;
};

function handleDisplayApp(
  state: DisplayAppState,
  action: Action<DisplayAppParams>
): DisplayAppState {
  return produce(state, (draft) => {
    draft.display = true;
  });
}
