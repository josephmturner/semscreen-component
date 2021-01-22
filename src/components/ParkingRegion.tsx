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
import { AppState } from "../reducers";

import MessageListItem from "./MessageListItem";
import NewMessageButton from "./NewMessageButton";

import { hasPoints } from "../dataModels/pointUtils";
import { SemanticScreenRouteParams } from "../dataModels/dataModels";

const ParkingSpace = (props: {
  params: SemanticScreenRouteParams;
  displayMessages: string[];
  darkMode?: boolean;
}) => {
  return (
    <InnerContainer>
      <NewMessageButton darkMode={props.darkMode} />
      {props.displayMessages.map((id: string, i: number) => (
        <MessageListItem
          params={props.params}
          type="draftMessage"
          messageId={id}
          index={i}
          darkMode={props.darkMode}
          key={id}
        />
      ))}
    </InnerContainer>
  );
};

const InnerContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  max-height: 8rem;
  flex-direction: column;
`;

const mapStateToProps = (state: AppState) => {
  const displayMessages = state.draftMessages.allIds.filter((id) =>
    hasPoints(id, state)
  );
  return {
    displayMessages,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingSpace);
