import { Action, Actions } from './constants';

export interface ExpandedRegionParams {
  region: string;
}

export const setExpandedRegion = (region: string): Action<ExpandedRegionParams> => {
  return {
    type: Actions.setExpandedRegion,
    params: {
      region,
    },
  };
};
