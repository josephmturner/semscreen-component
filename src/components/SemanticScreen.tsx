/*
  Copyright (C) 2021 by USHIN, Inc.

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
import styled from "styled-components";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { SemanticScreenRouteParams } from "../dataModels/dataModels";

import { AppState } from "../reducers";

import { togglePanel, PanelParams } from "../actions/panelsActions";
import { loadMessage, LoadMessageParams } from "../actions/dbActions";
import { PanelsState } from "../reducers/panels";

import RegionsGrid from "./RegionsGrid";
import PanelButton from "./PanelButton";
import ParkingRegion from "./ParkingRegion";
import RightPanelContents from "./RightPanelContents";

interface OwnProps {
  darkMode: boolean;
  isDraft?: boolean;
}

export const SemanticScreen = (props: OwnProps) => {
  const params: SemanticScreenRouteParams = useParams();
  return <WrappedSemanticScreen {...props} params={params} />;
};

interface OwnPropsWithRouteParams extends OwnProps {
  params: SemanticScreenRouteParams;
}

interface AllProps extends OwnPropsWithRouteParams {
  messageExists: boolean;
  panels: PanelsState;
  currentIdentityColor: string;
  togglePanel: (params: PanelParams) => void;
  loadMessage: (params: LoadMessageParams) => void;
}

const mapStateToProps = (
  state: AppState,
  ownProps: OwnPropsWithRouteParams
) => {
  const currentIdentityId = state.userIdentities.currentIdentity as string;
  const currentIdentity = state.userIdentities.byId[currentIdentityId];
  const currentIdentityColor = currentIdentity.color;

  const messageExists =
    (ownProps.isDraft &&
      state.draftMessages.allIds.includes(ownProps.params.messageId)) ||
    (!ownProps.isDraft &&
      state.messages.allIds.includes(ownProps.params.messageId));

  return {
    messageExists,
    panels: state.panels,
    currentIdentityColor,
  };
};

const mapDispatchToProps = {
  togglePanel,
  loadMessage,
};

export const WrappedSemanticScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: AllProps) => {
  const { messageId } = props.params;

  const onDragOverBottomPanel = () => {
    if (!props.panels.bottom) {
      props.togglePanel({ location: "bottom" });
    }
  };

  let mainPanelContent;
  if (!props.messageExists && props.isDraft) {
    mainPanelContent = <div>This draft doesn't exist.</div>;
  } else if (!props.messageExists && !props.isDraft) {
    mainPanelContent = <div>Loading published message...</div>;
    //TODO: Timeout if the message cannot be found?
    props.loadMessage({ messageId });
  } else {
    mainPanelContent = (
      <RegionsGrid params={props.params} darkMode={props.darkMode || false} />
    );
  }

  return (
    <AppStyles darkMode={props.darkMode}>
      <MainPanel>
        <SemscreenPanel>
          {mainPanelContent}
          <PanelButton
            params={props.params}
            side={"bottom"}
            color={props.currentIdentityColor}
            onClick={() => {
              props.togglePanel({ location: "bottom" });
            }}
            onDragOver={onDragOverBottomPanel}
            darkMode={props.darkMode}
          />
          <PanelButton
            params={props.params}
            side={"right"}
            color={props.currentIdentityColor}
            onClick={() => {
              props.togglePanel({ location: "right" });
            }}
            darkMode={props.darkMode}
          />
        </SemscreenPanel>
        {props.panels.bottom && (
          <BottomPanel>
            <ParkingRegion params={props.params} darkMode={props.darkMode} />
          </BottomPanel>
        )}
      </MainPanel>
      {props.panels.right && (
        <RightPanel>
          <RightPanelContents params={props.params} darkMode={props.darkMode} />
        </RightPanel>
      )}
    </AppStyles>
  );
});

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
