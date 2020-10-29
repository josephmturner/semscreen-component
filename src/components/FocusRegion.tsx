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
import FocusPoint from "./FocusPoint";
import StyledRegion from "./StyledRegion";
import SevenShapes from "./SevenShapes";
import { AuthorI, PointShape, RegionI } from "../dataModels/dataModels";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import { pointCreate, PointCreateParams } from "../actions/pointsActions";
import { setFocus, SetFocusParams } from "../actions/messagesActions";
import {
  setExpandedRegion,
  ExpandedRegionParams,
} from "../actions/expandedRegionActions";
import {
  setSelectedPoints,
  SetSelectedPointsParams,
  togglePoint,
  TogglePointParams,
} from "../actions/selectPointActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";

interface OwnProps {
  region: RegionI;
  isExpanded: "expanded" | "minimized" | "balanced";
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  author: AuthorI;
  pointId: string | undefined;
  selectedPoints: string[];
  isMainPoint: boolean;
  setFocus: (params: SetFocusParams) => void;
  setExpandedRegion: (params: ExpandedRegionParams) => void;
  pointCreate: (params: PointCreateParams) => void;
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  hoverOver: (params: HoverOverParams) => void;
}

//TODO: don't pass region to FocusRegion, since its only ever the
//Focus region
const FocusRegion = (props: AllProps) => {
  const { region, isExpanded, pointId } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      if (isExpanded !== "expanded") {
        props.setExpandedRegion({ region });
      }
      if (item.index !== 0 || item.region !== "focus") {
        props.hoverOver({
          index: 0,
          region: "focus",
        });

        item.index = 0;
        item.region = "focus";
      }
    },
    drop: () => {
      props.setFocus({});
    },
  });

  const createEmptyFocus = (shape: PointShape) => {
    //TODO: the author used to create a point should instead be some
    //global author (not the author of the current message)
    props.pointCreate({
      point: {
        author: props.author,
        content: "",
        shape,
      },
      index: 0,
      focus: true,
    });
  };

  const handlePointClick = (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }

    props.setSelectedPoints({ pointIds: [] });
  };

  return (
    <StyledRegion
      borderColor={props.author.color}
      onClick={() => props.setExpandedRegion({ region })}
      ref={drop}
    >
      <StyledDiv>
        {pointId && (
          <FocusPoint
            pointId={pointId}
            onClick={(e) => handlePointClick(e)}
            isMainPoint={props.isMainPoint}
            isSelected={props.selectedPoints.includes(pointId)}
            darkMode={props.darkMode}
          />
        )}
        {!pointId && isExpanded === "expanded" && (
          <SevenShapes
            onShapeClick={createEmptyFocus}
            darkMode={props.darkMode}
          />
        )}
      </StyledDiv>
    </StyledRegion>
  );
};

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const mapStateToProps = (state: AppState) => {
  const currentMessage =
    state.messages.byId[state.semanticScreen.currentMessage];
  const isMainPoint = currentMessage.focus === currentMessage.main;
  return {
    author: state.authors.byId[currentMessage.author],
    pointId: currentMessage.focus,
    selectedPoints: state.selectedPoints.pointIds,
    isMainPoint,
  };
};

const mapDispatchToProps = {
  setFocus,
  setExpandedRegion,
  pointCreate,
  togglePoint,
  setSelectedPoints,
  hoverOver,
};

export default connect(mapStateToProps, mapDispatchToProps)(FocusRegion);
