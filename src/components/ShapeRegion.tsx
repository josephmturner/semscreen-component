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
import Point from "./Point";
import NewPointButton from "./NewPointButton";
import StyledRegion from "./StyledRegion";
import RegionHeader from "./RegionHeader";
import { AuthorI, PointShape } from "../dataModels/dataModels";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  pointCreate,
  PointCreateParams,
  pointMove,
  PointMoveParams,
} from "../actions/pointsActions";
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

interface OwnProps {
  shape: PointShape;
  isExpanded: "expanded" | "minimized" | "balanced";
  readOnly: boolean;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  author: AuthorI;
  pointIds: string[];
  pointCreate: (params: PointCreateParams) => void;
  pointMove: (params: PointMoveParams) => void;
  setExpandedRegion: (params: ExpandedRegionParams) => void;
  selectedPoints: string[];
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
}

const ShapeRegion = (props: AllProps) => {
  const { shape, pointIds } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      if (item.isReferencedPoint && item.shape !== shape) return;
      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion({ region: shape });
      }

      const newIndex =
        item.shape === shape && typeof item.index === "number"
          ? pointIds.length - 1
          : pointIds.length;

      // TODO: some redundant logic, don't need if-else
      //Point was the focus (lacks index)
      if (typeof item.index !== "number") {
        props.pointMove({
          pointId: item.pointId,
          newShape: shape,
          newIndex: pointIds.length,
        });

        item.index = newIndex;
        item.shape = shape;
      } else {
        //Point wasn't already at the bottom of this region
        if (item.shape !== shape || item.index !== pointIds.length - 1) {
          props.pointMove({
            pointId: item.pointId,
            oldIndex: item.index,
            newShape: shape,
            newIndex: newIndex,
          });

          item.index = newIndex;
          item.shape = shape;
        }
      }
    },
  });

  const [, expandRef] = useDrop({
    accept: ItemTypes.POINT,
    hover: () => {
      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion({ region: shape });
      }
    },
  });

  const createEmptyPoint = () => {
    props.pointCreate({
      point: {
        author: props.author,
        content: "",
        shape,
      },
      index: pointIds.length,
    });
  };

  const onClickRemainingSpace = () => {
    if (props.isExpanded !== "expanded" && !props.readOnly) {
      createEmptyPoint();
    }
  };

  //TODO: this logic is duplicated in FocusPoint.tsx. Move into a hook?
  const handlePointClick = (pointId: string) => (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }
    if (e.ctrlKey || e.metaKey) {
      props.togglePoint({ pointId });
    } else {
      props.setSelectedPoints({ pointIds: [] });
    }
  };

  return (
    <StyledRegion
      borderColor={props.author.color}
      onClick={() => props.setExpandedRegion({ region: shape })}
      ref={expandRef}
    >
      <div>
        <RegionHeader shape={shape} darkMode={props.darkMode} />
        {pointIds.map((id: string) => (
          <Point
            key={id}
            pointId={id}
            index={pointIds.findIndex((pId) => pId === id)}
            onClick={handlePointClick(id)}
            readOnly={props.readOnly}
            isSelected={props.selectedPoints.includes(id)}
            darkMode={props.darkMode}
          />
        ))}
        {props.isExpanded === "expanded" && !props.readOnly && (
          <NewPointButton
            shape={shape}
            onClick={createEmptyPoint}
            darkMode={props.darkMode}
          />
        )}
        <DropTargetDiv
          ref={drop}
          isExpanded={props.isExpanded}
          onClick={onClickRemainingSpace}
        />
      </div>
    </StyledRegion>
  );
};

interface DropTargetDivProps {
  isExpanded: "expanded" | "minimized" | "balanced";
}

const DropTargetDiv = styled.div<DropTargetDivProps>`
  min-height: ${(props) => (props.isExpanded ? "50px" : 0)};
  height: 100%;
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  author: state.authors.byId[state.message.author],
  pointIds: state.message.shapes[ownProps.shape],
  selectedPoints: state.selectedPoints.pointIds,
});

const mapDispatchToProps = {
  pointCreate,
  pointMove,
  setExpandedRegion,
  togglePoint,
  setSelectedPoints,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeRegion);
