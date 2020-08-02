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
} from "../constants/AppState";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import { Details as CursorPositionDetails } from '../reducers/cursorPosition';
import { setCursorPosition } from '../actions/cursorPositionActions';

const Region = (props: {
  region: PointShape;
  isExpanded: "expanded" | "minimized" | "balanced";
  author: AuthorI;
  points: PointI[];
  focusPointId: string | undefined;
  mainPointId: string | undefined;
  appDispatch: any;
  cursorPosition: CursorPositionDetails | null;
  createEmptyPoint: any;
  onRegionClick: any;
  setExpandedRegion: any;
  editingPointId: string;
  setCursorPosition: (details: CursorPositionDetails) => void;
}) => {
  const {
    region,
    isExpanded,
    points,
    focusPointId,
    mainPointId,
    author,
    appDispatch,
    cursorPosition,
    createEmptyPoint,
    onRegionClick,
    setExpandedRegion,
    editingPointId,
  } = props;

  const renderPoints = points.filter((p) => p.pointId !== focusPointId);

  const placeholderText = `New ${region.toLowerCase()} point`;
  const placeholderImg = require(`../images/${region}.svg`);
  const placeholderImgAlt = region;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      //TODO: consider only calling appDispatch after the animation transition ends.
      if (isExpanded !== "expanded") {
        setExpandedRegion(region);
      }

      if (item.shape !== region || item.index !== points.length - 1) {
        const newIndex =
          item.shape === region ? points.length - 1 : points.length;

        appDispatch({
          type: "pointMove",
          pointId: item.pointId,
          oldShape: item.shape,
          oldIndex: item.index,
          newShape: region,
          newIndex: newIndex,
        });

        item.index = newIndex;
        item.shape = region;
      }
    },
  });

  return (
    <StyledRegion
      isExpanded={isExpanded}
      borderColor={author.color}
      onClick={() => onRegionClick(region, false)}
    >
      <div>
        {renderPoints.map((p: PointI) => (
          <Point
            key={p.pointId}
            point={p}
            shape={region}
            isExpanded={isExpanded}
            setExpandedRegion={setExpandedRegion}
            isMainPoint={mainPointId === p.pointId}
            index={points.findIndex((point) => point.pointId === p.pointId)}
            appDispatch={appDispatch}
            isEditing={editingPointId === p.pointId}
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
                index: points.findIndex((p) => p.pointId === editingPointId),
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
                props.setCursorPosition({
                  pointId: points[index - 1].pointId,
                  index: 0,
                });
              } else if (moveTo === "endOfPriorPoint") {
                props.setCursorPosition({
                  pointId: points[index - 1].pointId,
                  index: points[index - 1].content.length,
                });
              } else if (moveTo === "beginningOfNextPoint") {
                !(index === points.length - 1) &&
                  props.setCursorPosition({
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
          <>
            <Placeholder
              text={placeholderText}
              img={placeholderImg}
              imgAlt={placeholderImgAlt}
              onClick={() => {
                createEmptyPoint(region, points.length);
              }}
            />
          </>
        )}
        <DropTargetDiv ref={drop} isExpanded={isExpanded} />
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

const mapStateToProps = (state: AppState) => ({
  editingPointId: state.editingPoint.editingPointId,
  cursorPosition: state.cursorPosition.details,
});

const mapDispatchToProps = {
  setCursorPosition,
};

export default connect(mapStateToProps, mapDispatchToProps)(Region);
