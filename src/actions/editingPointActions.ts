import { Action, Actions } from "./constants";

export interface EditingPointParams {
  pointId: string;
}

export const setEditingPoint = (
  pointId: string
): Action<EditingPointParams> => {
  return {
    type: Actions.setEditingPoint,
    params: {
      pointId,
    },
  };
};
