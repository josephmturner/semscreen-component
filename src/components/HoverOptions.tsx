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
import { useHistory } from "react-router-dom";

import PublishButton from "./PublishButton";
import {
  blackOrWhite,
  getReferenceData,
  getOriginalAuthorId,
  getOriginalMessageId,
} from "../dataModels/pointUtils";
import {
  HoverOptionsType,
  PointReferenceI,
  SemanticScreenRouteParams,
} from "../dataModels/dataModels";

import { connect } from "react-redux";
import { AppState } from "../reducers";
import {
  pointsMoveToMessage,
  PointsMoveToMessageParams,
  draftPointsDelete,
  DraftPointsDeleteParams,
} from "../actions/draftPointsActions";
import {
  draftMessageDelete,
  DraftMessageDeleteParams,
  setMain,
  SetMainParams,
} from "../actions/draftMessagesActions";
import {
  viewOriginalMessage,
  ViewOriginalMessageParams,
} from "../actions/selectPointActions";

interface OwnProps {
  params: SemanticScreenRouteParams;
  type: HoverOptionsType;
  id: string;
  darkMode?: boolean;
  isSelected?: boolean;
}

interface AllProps extends OwnProps {
  draftMessageDelete: (params: DraftMessageDeleteParams) => void;
  draftPointsDelete: (params: DraftPointsDeleteParams) => void;
  pointsMoveToMessage: (params: PointsMoveToMessageParams) => void;
  setMain: (params: SetMainParams) => void;
  viewOriginalMessage: (params: ViewOriginalMessageParams) => void;
  pointsAreSelected: boolean;
  referenceData?: PointReferenceI;
}

const HoverOptions = (props: AllProps) => {
  const history = useHistory();

  let trashDispatch: any;
  switch (props.type) {
    case "draftPoint":
      trashDispatch = () =>
        props.draftPointsDelete({
          pointIds: [props.id],
          messageId: props.params.messageId,
          deleteSelectedPoints: true,
        });
      break;
    case "draftMessage":
      trashDispatch = () =>
        props.draftMessageDelete({
          messageId: props.id,
          currentMessageId: props.params.messageId,
          history,
        });
      break;
  }

  let originalAuthorId: string;
  let originalMessageId: string;
  if (props.referenceData) {
    // Type assertion is okay since ViewOriginalMessageButton only
    // appears on top of quoted points
    originalAuthorId = getOriginalAuthorId(
      props.referenceData as PointReferenceI
    );
    originalMessageId = getOriginalMessageId(
      props.referenceData as PointReferenceI
    );
  }

  function handleViewOriginalMessageButtonClick(e: React.MouseEvent) {
    history.push(`/u/${originalAuthorId}/m/${originalMessageId}`);
    props.viewOriginalMessage({ pointId: props.id });
    e.stopPropagation();
  }

  const ViewOriginalMessageButton = () => (
    <ButtonSvg
      onClick={handleViewOriginalMessageButtonClick}
      darkMode={props.darkMode}
      isSelected={props.isSelected}
      viewBox="0 0 16 16"
    >
      <title>View original message</title>
      <path d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z" />
    </ButtonSvg>
  );

  const MainPointButton = () => (
    <ButtonDiv
      darkMode={props.darkMode}
      isSelected={props.isSelected}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        props.setMain({
          newMainId: props.id,
          messageId: props.params.messageId,
        });
      }}
      title="Set main point"
    >
      !
    </ButtonDiv>
  );

  const PointsMoveButton = () => (
    <ButtonSvg
      onClick={(e: React.MouseEvent) => {
        props.pointsMoveToMessage({
          moveToMessageId: props.id,
          moveFromMessageId: props.params.messageId,
          history,
        });
        e.stopPropagation();
      }}
      darkMode={props.darkMode}
      isSelected={props.isSelected}
      viewBox="0 0 16 16"
    >
      <title>"Put selected points"</title>
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </ButtonSvg>
  );

  const TrashButton = () => (
    <RedButtonSvg
      onClick={(e: React.MouseEvent) => {
        if (trashDispatch) trashDispatch();
        e.stopPropagation();
      }}
      darkMode={props.darkMode}
      isSelected={props.isSelected}
      viewBox="0 0 16 16"
    >
      <title>
        {props.type === "draftMessage" ? "Delete message" : "Delete point"}
      </title>
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </RedButtonSvg>
  );

  const HoverButtons = () => {
    switch (props.type) {
      case "publishedPoint":
        return <>{props.referenceData && <ViewOriginalMessageButton />}</>;
      case "draftPoint":
        return (
          <>
            {props.referenceData && <ViewOriginalMessageButton />}
            <MainPointButton />
            <TrashButton />
          </>
        );
      case "draftMessage":
        return (
          <>
            {props.pointsAreSelected && <PointsMoveButton />}
            <PublishButton messageId={props.id} darkMode={props.darkMode} />
            <TrashButton />
          </>
        );
      case "publishedMessage":
        return null;
    }
  };

  return (
    <StyledHoverOptions isSelected={props.isSelected} darkMode={props.darkMode}>
      <HoverButtons />
    </StyledHoverOptions>
  );
};

interface StyledProps {
  darkMode?: boolean;
  isSelected?: boolean;
}

const StyledHoverOptions = styled.div<StyledProps>`
  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  position: absolute;
  display: flex;
  align-items: center;
  margin: auto;
  top: 0;
  bottom: 0;
  right: -0.5rem;
  height: 1rem;
  z-index: 10;
  background-color: var(--colorBG);
  border: 1px solid var(--colorFG);
  border-radius: 3px;
`;

export const ButtonSvg = styled.svg<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  fill: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    fill: var(--colorBG);
    background-color: var(--colorFG);
  }
`;

const ButtonDiv = styled.div<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  color: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    color: var(--colorBG);
    background-color: var(--colorFG);
  }
`;

const RedButtonSvg = styled.svg<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  fill: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    background-color: red;
  }
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const pointsAreSelected = state.selectedPoints.pointIds[0] !== undefined;

  let referenceData;
  if (ownProps.type === "publishedPoint" || ownProps.type === "draftPoint") {
    referenceData = getReferenceData(ownProps.id, state);
  }

  return {
    pointsAreSelected,
    referenceData,
  };
};

const mapDispatchToProps = {
  draftMessageDelete,
  draftPointsDelete,
  pointsMoveToMessage,
  setMain,
  viewOriginalMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(HoverOptions);