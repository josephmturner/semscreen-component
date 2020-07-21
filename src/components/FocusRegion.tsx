/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React, { useEffect, useState } from "react";
import FocusPoint from "./FocusPoint";
import FocusPlaceholder from "./FocusPlaceholder";
import StyledFocusRegion from "./StyledFocusRegion";
import SevenShapes from "./SevenShapes";
import { PointI, PointShape, RegionI } from "../constants/AppState";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

const FocusRegion = (props: {
  region: RegionI;
  isExpanded: "expanded" | "minimized" | "balanced";
  setExpandedRegion: (region: RegionI) => void;
  point: PointI | undefined;
  shape: PointShape;
  index: number;
  appDispatch: any;
  editingPoint: PointI["pointId"] | undefined;
  createEmptyFocus: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    setExpandedRegion,
    point,
    shape,
    index,
    appDispatch,
    editingPoint,
    createEmptyFocus,
    onRegionClick,
  } = props;

  const [newFocus, setNewFocus] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [hoveredShape, setHoveredShape] = useState<PointShape | undefined>(
    undefined
  );

  const placeholderText = `New focus point`;
  const placeholderImg = require(`../images/seven-shapes.svg`);
  const placeholderImgAlt = "Choose a new focus shape.";

  const handlePlaceholderClick = () => {
    setNewFocus(true);
  };

  const handleSevenShapesClick = (newShape: PointShape) => {
    if (newFocus) {
      setNewFocus(false);
      createEmptyFocus(newShape);
    } else if (!newFocus && point && shape !== newShape) {
      appDispatch({
        type: "changeFocusShape",
        pointId: point.pointId,
        oldShape: shape,
        oldIndex: index,
        newShape: newShape,
      });
    }
  };

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: () => {
      if (isExpanded !== "expanded") {
        setExpandedRegion(region);
      }
    },
  });

  useEffect(() => {
    isExpanded === "expanded" && !point
      ? setNewFocus(true)
      : setNewFocus(false);
  }, [isExpanded, point]);

  let pointContent;
  if (point) {
    pointContent = point.content;
  }

  useEffect(() => {
    point && point.content
      ? setShowPlaceholder(true)
      : setShowPlaceholder(false);
  }, [setShowPlaceholder, pointContent]);

  return (
    <StyledFocusRegion ref={drop} onClick={() => onRegionClick(region, false)}>
      <StyledDiv>
        {point && (
          <FocusPoint
            point={point}
            shape={shape}
            appDispatch={appDispatch}
            newFocus={newFocus}
            setNewFocus={setNewFocus}
            isEditing={point && editingPoint === point.pointId ? true : false}
            onEnterPress={() => console.log("enter pressed in focus region")}
            onClick={() => onRegionClick(region, true)}
          />
        )}
        {showPlaceholder && isExpanded === "expanded" && (
          <FocusPlaceholder
            text={placeholderText}
            img={placeholderImg}
            imgAlt={placeholderImgAlt}
            onClick={handlePlaceholderClick}
            emphasis={newFocus ? true : false}
          />
        )}
        {isExpanded === "expanded" && (
          <SevenShapes
            onShapeClick={handleSevenShapesClick}
            hoveredShape={hoveredShape}
            setHoveredShape={setHoveredShape}
          />
        )}
      </StyledDiv>
    </StyledFocusRegion>
  );
};

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default FocusRegion;
