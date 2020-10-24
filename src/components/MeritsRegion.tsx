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
//import FocusPoint from "./FocusPoint";
import StyledMeritsRegion from "./StyledMeritsRegion";
import { RegionI } from "../dataModels/dataModels";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  setExpandedRegion,
  ExpandedRegionParams,
} from "../actions/expandedRegionActions";

const MeritsRegion = (props: {
  region: RegionI;
  isExpanded: "expanded" | "minimized" | "balanced";
  setExpandedRegion: (params: ExpandedRegionParams) => void;
}) => {
  const { region, isExpanded } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: () => {
      if (isExpanded !== "expanded") {
        props.setExpandedRegion({ region });
      }
    },
  });

  return (
    <StyledMeritsRegion
      ref={drop}
      onClick={() => props.setExpandedRegion({ region })}
    >
      <StyledDiv></StyledDiv>
    </StyledMeritsRegion>
  );
};

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = {
  setExpandedRegion,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeritsRegion);
