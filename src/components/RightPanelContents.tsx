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

import PublishButton from "./PublishButton";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";

interface OwnProps {
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  isPersisted: boolean;
}

const RightPanelContents = (props: AllProps) => {
  return (
    <div>
      {!props.isPersisted && <PublishButton darkMode={props.darkMode} />}
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isPersisted: !state.messages.draftIds.includes(
      state.semanticScreen.currentMessage
    ),
  };
};

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(RightPanelContents);
