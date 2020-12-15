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
import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { AppState } from "./reducers/store";
import { togglePanel, PanelParams } from "./actions/panelsActions";
import { PanelsState } from "./reducers/panels";
import { DBState } from "./reducers/db";
import { loadDatabase } from "./actions/dbActions";

import SemanticScreen from "./components/SemanticScreen";
import PanelButton from "./components/PanelButton";
import ParkingRegion from "./components/ParkingRegion";
import RightPanelContents from "./components/RightPanelContents";

const App = (props: {
  togglePanel: (params: PanelParams) => void;
  panels: PanelsState;
  db: DBState;
  loadDatabase: () => void;
}) => {
  const darkMode = true;

  const onDragOverBottomPanel = () => {
    if (!props.panels.bottom) {
      props.togglePanel({ location: "bottom" });
    }
  };

  useEffect(() => {
    if (props?.db?.loading) props.loadDatabase();
  });

  return (
    <AppStyles darkMode={darkMode}>
      <MainPanel>
        <SemscreenPanel>
          <SemanticScreen darkMode={darkMode || false} />
          <PanelButton
            side={"bottom"}
            onClick={() => {
              props.togglePanel({ location: "bottom" });
            }}
            onDragOver={onDragOverBottomPanel}
            darkMode={darkMode}
          />
          <PanelButton
            side={"right"}
            onClick={() => {
              props.togglePanel({ location: "right" });
            }}
            darkMode={darkMode}
          />
        </SemscreenPanel>
        {props.panels.bottom && (
          <BottomPanel>
            <ParkingRegion darkMode={darkMode} />
          </BottomPanel>
        )}
      </MainPanel>
      {props.panels.right && (
        <RightPanel>
          <RightPanelContents darkMode={darkMode} />
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
  margin: 3px 0;
`;

const RightPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 16rem;
  overflow: hidden;
`;

const mapStateToProps = (state: AppState) => {
  return {
    panels: state.panels,
    db: state.db,
  };
};

const mapActionsToProps = {
  togglePanel,
  loadDatabase,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
