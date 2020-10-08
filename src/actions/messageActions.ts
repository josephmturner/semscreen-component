import { Action, Actions } from "./constants";
import { PointI, PointShape } from "../dataModels";

//import { MessageState } from "../reducers/message";

//export interface SetMessageParams {
//  message: MessageState;
//}
//
//export const setMessage = (
//  params: SetMessageParams
//): Action<SetMessageParams> => {
//  return {
//    type: Actions.setMessage,
//    params: params,
//  };
//};

export interface SetFocusParams {
  pointId: string;
  oldIndex: number;
  originalShape: PointShape;
}

export const setFocus = (params: SetFocusParams): Action<SetFocusParams> => {
  return {
    type: Actions.setFocus,
    params,
  };
};

export interface SetMainPointParams {
  pointId: string;
}

export const setMainPoint = (
  params: SetMainPointParams
): Action<SetMainPointParams> => {
  return {
    type: Actions.setMainPoint,
    params,
  };
};

export interface SplitIntoTwoPointsParams {
  topPoint: PointI;
  bottomPoint: PointI;
  shape: PointShape;
  index: number;
  newPointId: string;
}

export const splitIntoTwoPoints = (
  params: SplitIntoTwoPointsParams
): Action<SplitIntoTwoPointsParams> => {
  return {
    type: Actions.splitIntoTwoPoints,
    params,
  };
};
