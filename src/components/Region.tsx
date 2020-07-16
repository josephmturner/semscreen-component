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
// TODO: type appDispatch

import React from "react";
import Point from "./Point";
import Placeholder from "./Placeholder";
import StyledRegion from "./StyledRegion";
import {
  AuthorI,
  PointI,
  PointShape,
  CursorPositionI,
} from "../constants/AppState";

import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";

const Region = (props: {
  region: PointShape;
  isExpanded: string;
  author: AuthorI;
  points: PointI[];
  focusPointId: string | undefined;
  mainPointId: string | undefined;
  appDispatch: any;
  hoveredRegion: PointShape | undefined;
  editingPoint: PointI["pointId"] | undefined;
  cursorPosition?: CursorPositionI;
  createEmptyPoint: any;
  onRegionClick: any;
  setExpandedRegion: any;
}) => {
  const {
    region,
    isExpanded,
    points,
    focusPointId,
    mainPointId,
    author,
    appDispatch,
    hoveredRegion,
    editingPoint,
    cursorPosition,
    createEmptyPoint,
    onRegionClick,
    setExpandedRegion,
  } = props;

  const renderPoints = points.filter((p) => p.pointId !== focusPointId);

  const placeholderText = `New ${region.toLowerCase()} point`;
  const placeholderImg = require(`../images/${region}.svg`);
  const placeholderImgAlt = region;

  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      if (!ref.current) {
        return;
      }
      if (isExpanded !== "expanded") {
        setExpandedRegion(region);
      }
      //appDispatch calls get batched, so there's no way to make sure
      //than appDispatch({type: "setHoveredRegion" ... }) gets called
      //first. What's the answer? Should we set hoveredRegion in the
      //when we call appDispatch with "pointMove"?
      if (!hoveredRegion || hoveredRegion !== region) {
        appDispatch({
          type: "setHoveredRegion",
          region: region,
        });
      }
      if (hoveredRegion && hoveredRegion !== region) {
        appDispatch({
          type: "pointMove",
          pointId: item.pointId,
          oldShape: hoveredRegion,
          oldIndex: item.index,
          newShape: region,
          newIndex: points.length,
        });
      }
    },
  });

  drop(ref);

  return (
    <StyledRegion
      isExpanded={isExpanded}
      backgroundColor={author.styles.backgroundColor}
      onClick={() => onRegionClick(region, false)}
      ref={ref}
    >
      <div>
        {renderPoints.map((p: PointI) => (
          <Point
            key={p.pointId}
            point={p}
            shape={region}
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
                shape: region,
                index: points.findIndex((p) => p.pointId === editingPoint),
              });
            }}
            combinePoints={(
              aboveOrBelow: "above" | "below",
              point: PointI,
              shape: PointShape,
              index: number
            ) => {
              if (aboveOrBelow === "below" && index === points.length - 1) {
                return;
              } else {
                appDispatch({
                  type: "combinePoints",
                  aboveOrBelow: aboveOrBelow,
                  point: point,
                  shape: shape,
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
                ? cursorPosition.index
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
