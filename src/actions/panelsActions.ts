import { Action, Actions } from "./constants";


export interface PanelParams {
  location: "bottom" | "right";
}

export const showPanel = (params: PanelParams): Action<PanelParams> => {
  return {
    type: Actions.showPanel,
    params,
  };
};

export const hidePanel = (params: PanelParams): Action<PanelParams> => {
  return {
    type: Actions.hidePanel,
    params,
  };
};
