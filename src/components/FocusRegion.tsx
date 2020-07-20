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
import Placeholder from "./Placeholder";
import StyledFocusRegion from "./StyledFocusRegion";
import SevenShapes from "./SevenShapes";
import { PointI, PointShape, RegionI } from "../constants/AppState";
import styled from "styled-components";

const FocusRegion = (props: {
  region: RegionI;
  isExpanded: "expanded" | "minimized" | "balanced";
  point: PointI | undefined;
  shape: PointShape;
  appDispatch: any;
  editingPoint: PointI["pointId"] | undefined;
  createEmptyFocus: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    point,
    shape,
    appDispatch,
    editingPoint,
    createEmptyFocus,
    onRegionClick,
  } = props;

  const [chooseShapes, setChooseShapes] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [hoveredShape, setHoveredShape] = useState<PointShape | undefined>(
    undefined
  );

  const placeholderText = `New focus point`;
  const placeholderImg = require(`../images/seven-shapes.svg`);
  const placeholderImgAlt = "Choose a new focus shape.";

  const handlePlaceholderClick = () => {
    setChooseShapes(true);
  };

  const handleSevenShapesClick = (shape: PointShape) => {
    setChooseShapes(false);
    createEmptyFocus(shape);
  };

  useEffect(() => {
    isExpanded === "expanded" && !point
      ? setChooseShapes(true)
      : setChooseShapes(false);
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
    <StyledFocusRegion onClick={() => onRegionClick(region, false)}>
      <StyledDiv>
        {point && (
          <FocusPoint
            point={point}
            shape={shape}
            appDispatch={appDispatch}
            chooseShapes={chooseShapes}
            setChooseShapes={setChooseShapes}
            isEditing={point && editingPoint === point.pointId ? true : false}
            onEnterPress={() => console.log("enter pressed in focus region")}
            onClick={() => onRegionClick(region, true)}
          />
        )}
        {!chooseShapes && showPlaceholder && isExpanded === "expanded" && (
          <Placeholder
            text={placeholderText}
            img={placeholderImg}
            imgAlt={placeholderImgAlt}
            onClick={handlePlaceholderClick}
          />
        )}
        {isExpanded === "expanded" && (
          <SevenShapes
            expandedSevenShapes={chooseShapes}
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
  justify-content: space-around;
`;

export default FocusRegion;
