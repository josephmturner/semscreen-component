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

interface Props {
  authorId: string;
  darkMode: boolean;
  expandedRegion: string;
  isPersisted: boolean;
}

const SemanticScreen = (props: Props) => {
  const { expandedRegion } = props;

  // TODO: move regions to constants and rename allRegions
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

  //TODO: move isExpanded logic inside mapStateToProps in each region?
  const isExpanded = (region: RegionI) => {
    return region === expandedRegion
      ? "expanded"
      : expandedRegion === ""
      ? "balanced"
      : "minimized";
  };

  return (
    <StyledSemanticScreen
      expandedRegion={expandedRegion}
      ref={semanticScreenRef}
    >
      {props.isPersisted && (
        <Banner
          authorId={props.authorId}
          placement={{ top: "0", right: "0" }}
          fontSize={"medium"}
          darkMode={props.darkMode}
        />
      )}
      {regions.map((region: RegionI) => {
        //TODO: short-circuit evaluation instead of if statements?
        if (region === "merits") {
          return (
            <MeritsRegion
              region={region}
              isExpanded={isExpanded(region)}
              key={region}
            />
          );
        }
        if (region === "focus") {
          return (
            <FocusRegion
              region={region}
              isExpanded={isExpanded(region)}
              key={region}
              darkMode={props.darkMode}
            />
          );
        } else {
          return (
            <ShapeRegion
              shape={region}
              isExpanded={isExpanded(region)}
              key={region}
              darkMode={props.darkMode}
            />
          );
        }
      })}
    </StyledSemanticScreen>
  );
};

const mapStateToProps = (state: AppState) => ({
  authorId: state.messages.byId[state.semanticScreen.currentMessage].author,
  expandedRegion: state.expandedRegion.region,
  isPersisted: !state.messages.draftIds.includes(
    state.semanticScreen.currentMessage
  ),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SemanticScreen);
