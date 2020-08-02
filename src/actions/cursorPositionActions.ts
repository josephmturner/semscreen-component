import { Action, Actions } from "./constants";
import { Details } from "../reducers/cursorPosition";

export interface CursorPositionParams {
  details: Details | null;
}

export const setCursorPosition = (
  details: Details | null
): Action<CursorPositionParams> => {
  return {
    type: Actions.setCursorPosition,
    params: {
      details,
    },
  };
};
