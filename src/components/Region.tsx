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
import React from "react";
import Point from "./Point";
import Placeholder from "./Placeholder";
import StyledRegion from "./StyledRegion"; import {
  AuthorI,
  PointI,
  RegionI,
  SetCursorPositionI,
} from "../constants/AppState";

const Region = (props: {
  region: RegionI;
  mainPointId: string | undefined;
  isExpanded: string;
  author: AuthorI;
  points: PointI[];
  appDispatch: any;
  editingPoint: PointI["pointId"] | undefined;
  setCursorPosition?: SetCursorPositionI;
  createEmptyPoint: any;
  onRegionClick: any;
}) => {
  const {
    region,
    mainPointId,
    isExpanded,
    points,
    author,
    appDispatch,
    editingPoint,
    setCursorPosition,
    createEmptyPoint,
    onRegionClick,
  } = props;

  const renderPoints =
    isExpanded === "expanded" ? points : points.filter((p) => p.content);

  const placeholderText = `New ${region.toLowerCase()} point`;
  const placeholderImg = require(`../images/${region}.svg`);
  const placeholderImgAlt = region;

  return (
    <StyledRegion
      isExpanded={isExpanded}
      backgroundColor={author.styles.backgroundColor}
      onClick={() => onRegionClick(region, false)}
    >
      {renderPoints.map((p: any, i: number) => (
        <Point
          key={p.pointId}
          point={p}
          isMainPoint={mainPointId === p.pointId}
          index={i}
          appDispatch={appDispatch}
          isEditing={editingPoint === p.pointId}
          createPointBelow={(topContent, bottomContent) => {
            appDispatch({
              type: "splitIntoTwoPoints",
              topPoint: {
                author: author,
                content: topContent,
                shape: region,
              },
              bottomPoint: {
                author: author,
                content: bottomContent,
                shape: region,
              },
              index: points.findIndex((p) => p.pointId === editingPoint),
            });
          }}
          combineWithPriorPoint={(point: PointI, index: number) => {
            appDispatch({
              type: "combineWithPriorPoint",
              point: point,
              index: index,
            });
          }}
          setCursorPositionIndex={
            setCursorPosition && setCursorPosition.pointId === p.pointId
              ? !isNaN(setCursorPosition.index)
                ? setCursorPosition.index
                : 0
              : undefined
          }
          onClick={() => onRegionClick(region, true)}
        />
      ))}
      {isExpanded === "expanded" && (
        <Placeholder
          text={placeholderText}
          img={placeholderImg}
          imgAlt={placeholderImgAlt}
          onClick={() => {
            createEmptyPoint(region, points.length);
          }}
        />
      )}
    </StyledRegion>
  );
};

export default Region;
