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
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  setCurrentMessage,
  SetCurrentMessageParams,
} from "../actions/semanticScreenActions";
import { messageCreate, MessageCreateParams } from "../actions/messagesActions";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";


interface OwnProps {
  darkMode?: boolean;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
  messageCreate: (params: MessageCreateParams) => void;
}

interface AllProps extends OwnProps {
  selectedPointIds: string[];
}

const NewMessageButton = (props: AllProps) => {
  const handleClick = () => {
    props.messageCreate({});
  };

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      props.messageCreate({ pointIds: props.selectedPointIds });
    },
  });

  return (
    <StyledButton ref={drop} onClick={handleClick} darkMode={props.darkMode}>
      +
    </StyledButton>
  );
};

interface StyledProps {
  darkMode?: boolean;
}

const StyledButton = styled.button<StyledProps>`
  line-height: 0;
  border: 0;
  background-color: transparent;
  box-sizing: border-box;
  margin-top: 2px;
  height: 1rem;
  width: 100%;
  color: ${(props) => (props.darkMode ? "white" : "black")};
  :hover {
    border: 1px solid ${(props) => (props.darkMode ? "white" : "black")};
    border-radius: 7px;
  }
`;

const mapStateToProps = (state: AppState) => {
  return {
    selectedPointIds: state.selectedPoints.pointIds,
  };
};

const mapActionsToProps = {
  setCurrentMessage,
  messageCreate,
};

export default connect(mapStateToProps, mapActionsToProps)(NewMessageButton);
