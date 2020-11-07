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
import { AppState } from "../reducers/store";

import MessageListItem from "./MessageListItem";
import { StyledRegion, InnerContainer } from "./StyledRegion";
import NewMessageButton from "./NewMessageButton";

const ParkingSpace = (props: {
  nonPersistedMessages: string[];
  userColor: string;
  darkMode?: boolean;
}) => {
  return (
    <StyledRegion borderColor={props.userColor}>
      <InnerContainer>
        <NewMessageButton darkMode={props.darkMode} />
        {props.nonPersistedMessages.map((m) => (
          <MessageListItem messageId={m} darkMode={props.darkMode} />
        ))}
      </InnerContainer>
    </StyledRegion>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    nonPersistedMessages: state.messages.draftIds,
    //Replace "author1" with redux state for userId
    userColor: state.authors.byId["author1"].color,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingSpace);
