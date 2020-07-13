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
import StyledRegion from "./StyledRegion";
import {
  AuthorI,
  PointI,
  RegionI,
  CursorPositionI,
} from "../constants/AppState";

const Region = (props: {
  region: RegionI;
  isExpanded: string;
  author: AuthorI;
  points: PointI[];
  focusPointId: string | undefined;
  mainPointId: string | undefined;
  appDispatch: any;
  editingPoint: PointI["pointId"] | undefined;
  cursorPosition?: CursorPositionI;
  createEmptyPoint: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    points,
    focusPointId,
    mainPointId,
    author,
    appDispatch,
    editingPoint,
    cursorPosition,
    createEmptyPoint,
    onRegionClick,
  } = props;

  const renderPoints = points.filter((p) => p.pointId !== focusPointId);

  const placeholderText = `New ${region.toLowerCase()} point`;
  const placeholderImg = require(`../images/${region}.svg`);
  const placeholderImgAlt = region;

  return (
    <StyledRegion
      isExpanded={isExpanded}
      backgroundColor={author.styles.backgroundColor}
      onClick={() => onRegionClick(region, false)}
    >
      <div>
        {renderPoints.map((p: PointI) => (
          <Point
            key={p.pointId}
            point={p}
            isMainPoint={mainPointId === p.pointId}
            index={points.findIndex((point) => point.pointId === p.pointId)}
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
            combinePoints={(
              aboveOrBelow: "above" | "below",
              point: PointI,
              index: number
            ) => {
              if (aboveOrBelow === "below" && index === points.length - 1) {
                return;
              } else {
                appDispatch({
                  type: "combinePoints",
                  aboveOrBelow: aboveOrBelow,
                  point: point,
                  index: index,
                });
              }
            }}
            setCursorPosition={(index: number, moveTo: string) => {
              if (moveTo === "beginningOfPriorPoint") {
                appDispatch({
                  type: "setCursorPosition",
                  pointId: points[index - 1].pointId,
                  index: 0,
                });
              } else if (moveTo === "endOfPriorPoint") {
                appDispatch({
                  type: "setCursorPosition",
                  pointId: points[index - 1].pointId,
                  index: points[index - 1].content.length,
                });
              } else if (moveTo === "beginningOfNextPoint") {
                !(index === points.length - 1) &&
                  appDispatch({
                    type: "setCursorPosition",
                    pointId: points[index + 1].pointId,
                    index: 0,
                  });
              }
            }}
            cursorPositionIndex={
              cursorPosition && cursorPosition.pointId === p.pointId
                ? !isNaN(cursorPosition.index)
                  ? cursorPosition.index
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
      </div>
    </StyledRegion>
  );
};

export default Region;
