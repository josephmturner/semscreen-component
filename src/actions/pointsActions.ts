import { Action, Actions } from "./constants";
import { PointI, PointShape, PointNoIdI } from "../dataModels";
import { v4 as uuidv4 } from "uuid";

export interface PointCreateParams {
  point: PointNoIdI;
  index?: number;
  focus?: boolean;
}

export interface _PointCreateParams extends PointCreateParams {
  newPointId: string;
}

export const pointCreate = (
  params: PointCreateParams
): Action<_PointCreateParams> => {
  const newPointId = uuidv4();
  return {
    type: Actions.pointCreate,
    params: {
      ...params,
      newPointId,
    },
  };
};

export interface PointUpdateParams {
  point: PointI;
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
  pointId: string;
  oldIndex?: number;
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

export interface CombinePointsParams {
  shape: PointShape;
  keepIndex: number;
  deleteIndex: number;
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
  pointId: string;
  sliceIndex: number;
}

export interface _SplitIntoTwoPointsParams extends SplitIntoTwoPointsParams {
  newPointId: string;
}

export const splitIntoTwoPoints = (
  params: SplitIntoTwoPointsParams
): Action<_SplitIntoTwoPointsParams> => {
  const newPointId = uuidv4();
  return {
    type: Actions.splitIntoTwoPoints,
    params: {
      ...params,
      newPointId,
    },
  };
};
