/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React from "react";
import { connect } from "react-redux";

import SemanticScreen from "./components/SemanticScreen";
import OpenPanelButton from "./components/OpenPanelButton";
import ClosePanelButton from "./components/ClosePanelButton";
import ParkingSpace from "./components/ParkingSpace";

import { showPanel, hidePanel, PanelParams } from "./actions/panelsActions";
import { PanelsState } from "./reducers/panels";
import { AppState } from "./reducers/store";

import styled from "styled-components";

const App = (props: {
  showPanel: (params: PanelParams) => void;
  hidePanel: (params: PanelParams) => void;
  panels: PanelsState;
}) => {
  const readOnly = false;
  const darkMode = true;

  return (
    <AppStyles darkMode={darkMode}>
      <SemscreenPanel right={props.panels.right} bottom={props.panels.bottom}>
        <SemanticScreen
          readOnly={readOnly || false}
          darkMode={darkMode || false}
        />
      </SemscreenPanel>
      {!props.panels.right && (
        <OpenPanelButton
          side={"right"}
          onClick={() => {
            props.showPanel({ location: "right" });
          }}
          darkMode={darkMode}
        />
      )}
      {props.panels.right && (
        <RightPanel>
          <ParkingSpace darkMode={darkMode} />
          <ClosePanelButton
            side={"right"}
            onClick={() => props.hidePanel({ location: "right" })}
            darkMode={darkMode}
          />
        </RightPanel>
      )}
      {!props.panels.bottom && (
        <OpenPanelButton
          side={"bottom"}
          onClick={() => {
            props.showPanel({ location: "bottom" });
          }}
          darkMode={darkMode}
        />
      )}
      {props.panels.bottom && (
        <BottomPanel>
          <ParkingSpace darkMode={darkMode} />
          <ClosePanelButton
            side={"bottom"}
            onClick={() => props.hidePanel({ location: "bottom" })}
            darkMode={darkMode}
          />
        </BottomPanel>
      )}
    </AppStyles>
  );
};

const AppStyles = styled.div<{ darkMode: boolean }>`
  height: 100%;

  ${(props) =>
    props.darkMode
      ? `
    --thumbBG: #7e7e7e;
    --scrollbarBG: black;
  `
      : `
    --thumbBG: #696969;
    --scrollbarBG: white;
  `}

  *>div {
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    scrollbar-width: thin;
  }
  * > div ::-webkit-scrollbar {
    width: 11px;
  }
  * > div ::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border: 3px solid var(--scrollbarBG);
  }
`;

const SemscreenPanel = styled.div<PanelsState>`
  height: ${(props) => (props.bottom ? "calc(100% - 4rem)" : "100%")};
  width: ${(props) => (props.right ? "calc(100% - 16rem)" : "100%")};
`;

const RightPanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 16rem;
`;

const BottomPanel = styled.div`
  position: absolute;
  height: 4rem;
  width: 100%;
`;

const mapStateToProps = (state: AppState) => {
  return {
    panels: state.panels,
  };
};

const mapActionsToProps = {
  showPanel,
  hidePanel,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
