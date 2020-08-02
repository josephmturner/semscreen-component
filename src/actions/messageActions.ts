import { Action, Actions } from "./constants";
import { PointI, PointShape, PointNoIdI } from "../dataModels";

export interface PointCreateParams {
  point: PointNoIdI;
  shape: PointShape;
  index: number;
  focus?: boolean;
}

export const pointCreate = (
  params: PointCreateParams
): Action<PointCreateParams> => {
  return {
    type: Actions.pointCreate,
    params,
  };
};

export interface PointUpdateParams {
  point: PointI;
  shape: PointShape;
}

export const pointUpdate = (
  params: PointUpdateParams
): Action<PointUpdateParams> => {
  return {
    type: Actions.pointUpdate,
    params,
  };
};

export interface PointMoveParams {
  pointId: PointI["pointId"];
  oldShape: PointShape;
  oldIndex: number;
  newShape: PointShape;
  newIndex: number;
}

export const pointMove = (params: PointMoveParams): Action<PointMoveParams> => {
  return {
    type: Actions.pointMove,
    params,
  };
};

export interface PointsDeleteParams {
  pointIds: string[];
}

export const pointsDelete = (
  params: PointsDeleteParams
): Action<PointsDeleteParams> => {
  return {
    type: Actions.pointsDelete,
    params,
  };
};

export interface SetFocusParams extends PointMoveParams {}

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

export interface CombinePointsParams {
  aboveOrBelow: "above" | "below";
  point: PointI;
  shape: PointShape;
  index: number;
}

export const combinePoints = (
  params: CombinePointsParams
): Action<CombinePointsParams> => {
  return {
    type: Actions.combinePoints,
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
