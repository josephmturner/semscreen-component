import { useReducer } from "react";

interface PanelAction {
  panel: "bottom" | "right";
  show: boolean;
}

export interface PanelState {
  right: boolean;
  bottom: boolean;
}

const initialPanelState = {
  right: false,
  bottom: false,
};

function panelReducer(panelState: PanelState, action: PanelAction) {
  switch (action.panel) {
    case "right":
      return { ...panelState, right: action.show };
    case "bottom":
      return { ...panelState, bottom: action.show };
  }
}

const usePanel = () => {
  return useReducer(panelReducer, initialPanelState);
};

export default usePanel;
