import { Action, Actions } from "./constants";

export interface SetSelectedPointsParams {
  pointIds: string[];
}

export const setSelectedPoints = (params: SetSelectedPointsParams): Action<SetSelectedPointsParams> => {
  return {
    type: Actions.setSelectedPoints,
    params,
  };
}

export interface TogglePointParams {
  pointId: string;
}

export const togglePoint = (params: TogglePointParams): Action<TogglePointParams> => {
  return {
    type: Actions.togglePoint,
    params,
  };
};
