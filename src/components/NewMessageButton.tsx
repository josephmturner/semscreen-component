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
import React, { useState } from "react";
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  setCurrentMessage,
  SetCurrentMessageParams,
} from "../actions/semanticScreenActions";
import { messageCreate, MessageCreateParams } from "../actions/messagesActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

interface OwnProps {
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  selectedPointIds: string[];
  isDragHovered: boolean;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
  messageCreate: (params: MessageCreateParams) => void;
  hoverOver: (params: HoverOverParams) => void;
}

const NewMessageButton = (props: AllProps) => {
  const handleClick = () => {
    props.messageCreate({});
  };

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      props.messageCreate({});
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

  return (
    <StyledButton
      ref={drop}
      onClick={handleClick}
      darkMode={props.darkMode}
      isHovered={isHovered || props.isDragHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      +
    </StyledButton>
  );
};

interface StyledProps {
  darkMode?: boolean;
  isHovered: boolean;
}

const StyledButton = styled.button<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
  height: 1rem;
  width: 100%;
  color: ${(props) => (props.darkMode ? "white" : "black")};

  ${(props) =>
    props.isHovered &&
    `
    border: 1px solid ${props.darkMode ? "white" : "black"};
    border-radius: 3px;
  `}
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
    selectedPointIds: state.selectedPoints.pointIds,
    isDragHovered,
  };
};

const mapActionsToProps = {
  setCurrentMessage,
  messageCreate,
  hoverOver,
};

export default connect(mapStateToProps, mapActionsToProps)(NewMessageButton);
