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
import React, { useEffect, useRef } from "react";

import { wrapGrid } from "animate-css-grid";

import ShapeRegion from "./ShapeRegion";
import MeritsRegion from "./MeritsRegion";
import FocusRegion from "./FocusRegion";
import Banner from "./Banner";
import StyledSemanticScreen from "./StyledSemanticScreen";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";

import { RegionI } from "../dataModels/dataModels";
import { getMessageById, isUserIdentity } from "../dataModels/pointUtils";

interface Props {
  authorId: string;
  darkMode: boolean;
  expandedRegion: string;
  BGColor: string;
}

const SemanticScreen = (props: Props) => {
  const { expandedRegion } = props;

  const regions: RegionI[] = [
    "facts",
    "merits",
    "people",
    "thoughts",
    "focus",
    "actions",
    "feelings",
    "needs",
    "topics",
  ];

  const semanticScreenRef = useRef<HTMLDivElement>();

  useEffect(() => {
    semanticScreenRef.current &&
      wrapGrid(semanticScreenRef.current, {
        duration: 150,
        easing: "linear",
      });
  }, []);

  return (
    <StyledSemanticScreen
      expandedRegion={expandedRegion}
      ref={semanticScreenRef}
      BGColor={props.BGColor}
    >
      <Banner
        authorId={props.authorId}
        placement={{ top: "0", right: "0" }}
        fontSize={"medium"}
        darkMode={props.darkMode}
      />
      {regions.map((region: RegionI) => {
        if (region === "merits") {
          return <MeritsRegion region={region} key={region} />;
        }
        if (region === "focus") {
          return (
            <FocusRegion
              region={region}
              key={region}
              darkMode={props.darkMode}
            />
          );
        } else {
          return (
            <ShapeRegion
              shape={region}
              key={region}
              darkMode={props.darkMode}
            />
          );
        }
      })}
    </StyledSemanticScreen>
  );
};

const mapStateToProps = (state: AppState) => {
  const currentMessage = getMessageById(
    state.semanticScreen.currentMessage,
    state
  );
  const authorId = currentMessage.author;
  const BGColor = isUserIdentity(authorId, state)
    ? state.userIdentities.byId[authorId].color
    : state.authors.byId[authorId].color;
  return {
    authorId,
    expandedRegion: state.expandedRegion.region,
    BGColor,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SemanticScreen);
