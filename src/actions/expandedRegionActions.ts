import { Action, Actions } from "./constants";
import { RegionI } from "../dataModels";

export interface ExpandedRegionParams {
  region: RegionI | "";
}

export const setExpandedRegion = (
  params: ExpandedRegionParams
): Action<ExpandedRegionParams> => {
  return {
    type: Actions.setExpandedRegion,
    params,
  };
};
