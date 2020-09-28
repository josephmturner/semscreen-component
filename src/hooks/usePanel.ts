import { useReducer } from "react";

interface PanelAction {
  panel: "bottom";
  show: boolean;
}

export interface PanelState {
  bottom: boolean;
}

const initialPanelState = {
  bottom: false,
};

function panelReducer(panelState: PanelState, action: PanelAction) {
  switch (action.panel) {
    case "bottom":
      return { ...panelState, bottom: action.show };
  }
}

const usePanel = () => {
  return useReducer(panelReducer, initialPanelState);
};

export default usePanel;
