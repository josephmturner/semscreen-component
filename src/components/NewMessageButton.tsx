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
import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { AppState } from "../reducers";
import {
  draftMessageCreate,
  DraftMessageCreateParams,
} from "../actions/draftMessagesActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

import { blackOrWhite } from "../dataModels/pointUtils";

interface OwnProps {
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  isDragHovered: boolean;
  draftMessageCreate: (params: DraftMessageCreateParams) => void;
  hoverOver: (params: HoverOverParams) => void;
}

const NewMessageButton = (props: AllProps) => {
  const { messageId } = useParams();
  const history = useHistory();

  const handleClick = () => {
    props.draftMessageCreate({ oldMessageId: messageId, history });
  };

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      props.draftMessageCreate({ oldMessageId: messageId, history });
    },
    hover: () => {
      //When hovering over the NewMessageButton, drag.context will be set
      //to { region: "parking", index: -1 }
      if (!props.isDragHovered) {
        props.hoverOver({
          region: "parking",
          index: -1,
        });
      }
    },
  });

  const [isHovered, setIsHovered] = useState(false);

  const PlusButton = () => (
    <InnerContainer darkMode={props.darkMode}>
      <ButtonSvg
        isHovered={isHovered || props.isDragHovered}
        darkMode={props.darkMode}
        viewBox="0 0 16 16"
      >
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
      </ButtonSvg>
    </InnerContainer>
  );

  return (
    <ContainerButton
      ref={drop}
      onClick={handleClick}
      darkMode={props.darkMode}
      isHovered={isHovered || props.isDragHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Create new message"
    >
      <PlusButton />
    </ContainerButton>
  );
};

interface StyledProps {
  darkMode?: boolean;
  isHovered: boolean;
}

const ContainerButton = styled.button<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
  padding: 0.25rem 0;
  width: 100%;

  ${(props) =>
    props.isHovered &&
    `
    border: 1px solid ${props.darkMode ? "white" : "black"};
    border-radius: 3px;
  `}
`;

const ButtonSvg = styled.svg<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  --colorFG: ${(props) => blackOrWhite(props.darkMode)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode)[1]};

  fill: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  ${(props) =>
    props.isHovered &&
    `
    fill: var(--colorBG);
    background-color: var(--colorFG);
`}
`;

const InnerContainer = styled.div<{ darkMode?: boolean }>`
  display: flex;
  align-items: center;
  margin: auto;
  height: 1rem;
  z-index: 10;
  background-color: ${(props) => (props.darkMode ? "black" : "white")};
  border: 1px solid ${(props) => (props.darkMode ? "white" : "black")};
  border-radius: 3px;
`;

const mapStateToProps = (state: AppState) => {
  let isDragHovered = false;
  if (
    state.drag.context &&
    state.drag.context.region === "parking" &&
    state.drag.context.index === -1
  )
    isDragHovered = true;

  return {
    isDragHovered,
  };
};

const mapDispatchToProps = {
  draftMessageCreate,
  hoverOver,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMessageButton);
