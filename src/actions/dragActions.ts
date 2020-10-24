import { Action, Actions } from "./constants";

export interface HoverOverParams {
  index: number;
  region: string;
}

export const hoverOver = (params: HoverOverParams): Action<HoverOverParams> => {
  return {
    type: Actions.hoverOver,
    params,
  };
};

export interface EndDragParams {}

export const endDrag = (params: EndDragParams): Action<EndDragParams> => {
  return {
    type: Actions.endDrag,
    params,
  };
};
