import { Action, Actions } from "./constants";
import { PointShape } from "../dataModels";

export type MoveToType = "beginningOfPriorPoint" | "endOfPriorPoint" | "beginningOfNextPoint";

export interface CursorPositionParams {
  moveTo: MoveToType;
  index: number;
  shape: PointShape;
}

export const setCursorPosition = (
  params: CursorPositionParams
): Action<CursorPositionParams> => {
  return {
    type: Actions.setCursorPosition,
    params,
  };
};

export const clearCursorPosition = (): Action => {
  return {
    type: Actions.clearCursorPosition,
    params: {},
  };
};
