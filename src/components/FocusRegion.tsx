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
import { AuthorI, PointShape, RegionI } from "../dataModels";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import { pointCreate, PointCreateParams } from "../actions/pointsActions";
import { setFocus, SetFocusParams } from "../actions/messageActions";
import {
  setExpandedRegion,
  ExpandedRegionParams,
} from "../actions/expandedRegionActions";

interface OwnProps {
  region: RegionI;
  isExpanded: "expanded" | "minimized" | "balanced";
  readOnly: boolean;
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
}

//TODO: don't pass region to FocusRegion, since its only ever the
//Focus region
const FocusRegion = (props: AllProps) => {
  const { region, isExpanded, pointId } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: () => {
      if (isExpanded !== "expanded") {
        props.setExpandedRegion({ region });
      }
    },
    drop: (item: DraggablePointType) => {
      if (typeof item.index === "number") {
        props.setFocus({
          pointId: item.pointId,
          oldIndex: item.index,
          originalShape: item.originalShape,
        });
      }
    },
  });

  const createEmptyFocus = (shape: PointShape) => {
    props.pointCreate({
      point: {
        author: props.author,
        content: "",
        shape,
      },
      focus: true,
    });
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
            readOnly={props.readOnly}
            isExpanded={props.isExpanded}
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
  const isMainPoint = state.message.focus === state.message.main;
  return {
    author: state.message.author,
    pointId: state.message.focus,
    selectedPoints: state.selectedPoints.pointIds,
    isMainPoint,
  };
};

const mapDispatchToProps = {
  setFocus,
  setExpandedRegion,
  pointCreate,
};

export default connect(mapStateToProps, mapDispatchToProps)(FocusRegion);
