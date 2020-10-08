import { Action, Actions } from "./constants";

export interface ExpandedRegionParams {
  region: string;
}

export const setExpandedRegion = (
  params: ExpandedRegionParams
): Action<ExpandedRegionParams> => {
  return {
    type: Actions.setExpandedRegion,
    params,
  };
};
