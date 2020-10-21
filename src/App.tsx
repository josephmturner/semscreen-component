/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React from "react";
import { connect } from "react-redux";

import SemanticScreen from "./components/SemanticScreen";
import PanelButton from "./components/PanelButton";
import ParkingSpace from "./components/ParkingSpace";

import { togglePanel, PanelParams } from "./actions/panelsActions";
import { PanelsState } from "./reducers/panels";
import { AppState } from "./reducers/store";

import styled from "styled-components";

const App = (props: {
  togglePanel: (params: PanelParams) => void;
  panels: PanelsState;
}) => {
  const readOnlyOverride = false;
  const darkMode = true;

  return (
    <AppStyles darkMode={darkMode}>
      <MainPanel>
        <SemscreenPanel>
          <SemanticScreen
            readOnlyOverride={readOnlyOverride || false}
            darkMode={darkMode || false}
          />
          <PanelButton
            side={"bottom"}
            openClose={"open"}
            onClick={() => {
              props.togglePanel({ location: "bottom" });
            }}
            darkMode={darkMode}
          />
          <PanelButton
            side={"right"}
            openClose={"open"}
            onClick={() => {
              props.togglePanel({ location: "right" });
            }}
            darkMode={darkMode}
          />
        </SemscreenPanel>
        {props.panels.bottom && (
          <BottomPanel>
            <ParkingSpace />
          </BottomPanel>
        )}
      </MainPanel>
      {props.panels.right && (
        <RightPanel>
          <ParkingSpace />
        </RightPanel>
      )}
    </AppStyles>
  );
};

const AppStyles = styled.div<{ darkMode: boolean }>`
  display: flex;
  height: 100%;

  ${(props) =>
    props.darkMode
      ? `
    --thumbBG: #7e7e7e;
    --scrollbarBG: black;
    background-color: black;
    color: white;
  `
      : `
    --thumbBG: #696969;
    --scrollbarBG: white;
    background-color: white;
    color: black;
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

const MainPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const SemscreenPanel = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const BottomPanel = styled.div`
  height: 4rem;
`;

const RightPanel = styled.div`
  width: 16rem;
`;

const mapStateToProps = (state: AppState) => {
  return {
    panels: state.panels,
  };
};

const mapActionsToProps = {
  togglePanel,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
