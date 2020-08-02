import { Action, Actions } from './constants';
import { PointI, PointShape } from '../constants/AppState';

export interface CombinePointsParams {
  aboveOrBelow: "above" | "below";
  point: PointI;
  shape: PointShape;
  index: number;
}

export const combinePoints = (params: CombinePointsParams): Action<CombinePointsParams> => {
  return {
    type: Actions.combinePoints,
    params,
  }
}

export interface SplitIntoTwoPointsParams {
  topPoint: PointI;
  bottomPoint: PointI;
  shape: PointShape;
  index: number;
}

export const splitIntoTwoPoints = (params: SplitIntoTwoPointsParams): Action<SplitIntoTwoPointsParams> => {
  return {
    type: Actions.splitIntoTwoPoints,
    params,
  }
}
