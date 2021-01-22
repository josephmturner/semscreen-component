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
import React, { useEffect, useRef } from "react";
import { wrapGrid } from "animate-css-grid";

import ShapeRegion from "./ShapeRegion";
import MeritsRegion from "./MeritsRegion";
import CenterRegion from "./CenterRegion";
import Banner from "./Banner";
import StyledRegionsGrid from "./StyledRegionsGrid";

import { connect } from "react-redux";
import { AppState } from "../reducers";

import { RegionI, SemanticScreenRouteParams } from "../dataModels/dataModels";
import { isUserIdentity } from "../dataModels/pointUtils";

interface OwnProps {
  params: SemanticScreenRouteParams;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  authorId: string;
  expandedRegion: string;
  BGColor: string;
}

const RegionsGrid = (props: AllProps) => {
  const { expandedRegion } = props;

  const regions: RegionI[] = [
    "facts",
    "merits",
    "people",
    "thoughts",
    "center",
    "actions",
    "feelings",
    "needs",
    "topics",
  ];

  const regionsGridRef = useRef<HTMLDivElement>();

  useEffect(() => {
    regionsGridRef.current &&
      wrapGrid(regionsGridRef.current, {
        duration: 150,
        easing: "linear",
      });
  }, []);

  return (
    <StyledRegionsGrid
      expandedRegion={expandedRegion}
      ref={regionsGridRef}
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
        if (region === "center") {
          return (
            <CenterRegion
              params={props.params}
              region={region}
              key={region}
              darkMode={props.darkMode}
            />
          );
        } else {
          return (
            <ShapeRegion
              params={props.params}
              shape={region}
              key={region}
              darkMode={props.darkMode}
            />
          );
        }
      })}
    </StyledRegionsGrid>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const { authorId } = ownProps.params;
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

export default connect(mapStateToProps, mapDispatchToProps)(RegionsGrid);
