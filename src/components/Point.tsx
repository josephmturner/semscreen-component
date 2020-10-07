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
import React, { useEffect, useRef, useState } from "react";
import { AuthorI, PointI, PointShape } from "../dataModels";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import Banner from "./Banner";
import { v4 as uuidv4 } from "uuid";

import { useDrop, DropTargetMonitor } from "react-dnd";
import { useDragPoint } from "../hooks/useDragPoint";
import { XYCoord } from "dnd-core";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

import { connect } from "react-redux";
import {
  setCursorPosition,
  clearCursorPosition,
  CursorPositionParams,
} from "../actions/cursorPositionActions";
import {
  splitIntoTwoPoints,
  SplitIntoTwoPointsParams,
  combinePoints,
  CombinePointsParams,
  pointMove,
  PointMoveParams,
  pointUpdate,
  PointUpdateParams,
  setMainPoint,
  SetMainPointParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/messageActions";
import { setExpandedRegion } from "../actions/expandedRegionActions";
import {
  setSelectedPoints,
  SetSelectedPointsParams,
  togglePoint,
  TogglePointParams,
} from "../actions/selectPointActions";

const Point = (props: {
  point: PointI;
  shape: PointShape;
  index: number;
  readOnly: boolean;
  isExpanded: "expanded" | "minimized" | "balanced";
  isMainPoint: boolean;
  isSelected: boolean;
  splitIntoTwoPoints: (params: SplitIntoTwoPointsParams) => void;
  combinePoints: (params: CombinePointsParams) => void;
  cursorPositionIndex: number | undefined;
  setCursorPosition: (params: CursorPositionParams) => void;
  clearCursorPosition: () => void;
  pointMove: (params: PointMoveParams) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
  setExpandedRegion: (region: string) => void;
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
  darkMode?: boolean;
}) => {
  const {
    point,
    shape,
    index,
    combinePoints,
    cursorPositionIndex,
    clearCursorPosition,
    setCursorPosition,
  } = props;

  const createPointBelow = (topContent: string, bottomContent: string) => {
    const newPointId = uuidv4();
    props.splitIntoTwoPoints({
      topPoint: {
        content: topContent,
        _id: point._id,
        pointDate: new Date(),
      },
      bottomPoint: {
        content: bottomContent,
        _id: newPointId,
        pointDate: new Date(),
      },
      shape: shape,
      index: index,
      newPointId: newPointId,
    });
  };

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover(item: DraggablePointType, monitor: DropTargetMonitor) {
      if (!ref.current || (item.quoted && item.shape !== shape)) {
        return;
      }
      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion(shape);
      }
      //TODO: only call the following logic after the animation transition ends. 150ms timeout?
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.pointMove({
        pointId: item.pointId,
        oldShape: item.shape,
        oldIndex: item.index,
        newShape: shape,
        newIndex: hoverIndex,
      });

      item.index = hoverIndex;
      item.shape = shape;
    },
  });

  const ref = useRef<HTMLTextAreaElement>(null);

  const pointRef = useRef<HTMLSpanElement>(null);

  const { isDragging, drag, preview } = useDragPoint(point, shape, index);

  drop(preview(pointRef));

  useEffect(() => {
    if (!isNaN(cursorPositionIndex as number) && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        cursorPositionIndex as number,
        cursorPositionIndex as number
      );
      clearCursorPosition();
    }
  }, [cursorPositionIndex, clearCursorPosition]);

  const [arrowPressed, setArrowPressed] = useState<
    "ArrowUp" | "ArrowDown" | undefined
  >(undefined);
  useEffect(() => {
    if (arrowPressed === "ArrowUp" && ref.current) {
      ref.current &&
        ref.current.selectionStart === 0 &&
        setCursorPosition({ moveTo: "beginningOfPriorPoint", index, shape });
    } else if (arrowPressed === "ArrowDown" && ref.current) {
      ref.current &&
        ref.current.selectionStart === point.content.length &&
        setCursorPosition({ moveTo: "beginningOfNextPoint", index, shape });
    }
    setArrowPressed(undefined);
  }, [arrowPressed, index, point.content.length, setCursorPosition, shape]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
      shape: shape,
    });
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const handleClick = (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }
    if (e.ctrlKey) {
      props.togglePoint({ pointId: point._id });
    } else {
      props.setSelectedPoints({ pointIds: [] });
    }
  };

  const onClickShapeIcon = () => {
    if (!props.readOnly) {
      props.setMainPoint({ pointId: point._id });
    }
  };

  return (
    <StyledSpan
      onClick={handleClick}
      ref={pointRef}
      isMainPoint={props.isMainPoint}
      isDragging={isDragging}
      isFirst={index === 0 ? true : false}
      isSelected={props.isSelected}
      quotedAuthor={point.quotedAuthor}
    >
      <StyledImg
        ref={props.readOnly ? null : drag}
        src={imageUrl}
        onClick={onClickShapeIcon}
        isMainPoint={props.isMainPoint}
        darkMode={props.darkMode}
        quotedAuthor={point.quotedAuthor}
        height={props.isMainPoint ? 23 : 17}
        alt={shape}
      />
      <StyledTextArea
        value={point.content}
        onChange={handleChange}
        onBlur={() => {
          if (!point.content) props.pointsDelete({ pointIds: [point._id] });
        }}
        readOnly={!!point.quotedAuthor || props.readOnly}
        isMainPoint={props.isMainPoint}
        quotedAuthor={point.quotedAuthor}
        darkMode={props.darkMode}
        ref={ref}
        autoFocus={true}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (props.readOnly) {
            return;
          } else {
            if (e.key === "Enter") {
              e.preventDefault();
              ref.current &&
                !!point.content &&
                createPointBelow(
                  point.content.slice(0, ref.current.selectionStart),
                  point.content.slice(ref.current.selectionStart)
                );
            } else if (
              e.key === "Backspace" &&
              ref.current &&
              ref.current.selectionStart === 0 &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              if (index !== 0) {
                e.preventDefault();
                combinePoints({
                  shape,
                  keepIndex: index - 1,
                  deleteIndex: index,
                });
              } else if (index === 0 && !point.content) {
                e.preventDefault();
                combinePoints({
                  shape,
                  keepIndex: index,
                  deleteIndex: index + 1,
                });
              }
            } else if (
              e.key === "Delete" &&
              ref.current &&
              ref.current.selectionStart === point.content.length &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              e.preventDefault();
              combinePoints({
                shape,
                keepIndex: index,
                deleteIndex: index + 1,
              });
            } else if (
              e.key === "ArrowLeft" &&
              ref.current &&
              ref.current.selectionStart === 0 &&
              ref.current.selectionStart === ref.current.selectionEnd &&
              index !== 0
            ) {
              e.preventDefault();
              setCursorPosition({ moveTo: "endOfPriorPoint", index, shape });
            } else if (
              e.key === "ArrowRight" &&
              ref.current &&
              ref.current.selectionStart === point.content.length &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              e.preventDefault();
              setCursorPosition({
                moveTo: "beginningOfNextPoint",
                index,
                shape,
              });
            } else if (e.key === "ArrowUp" && index !== 0) {
              setArrowPressed("ArrowUp");
            } else if (e.key === "ArrowDown") {
              setArrowPressed("ArrowDown");
            }
          }
        }}
      />
      {point.quotedAuthor && (
        <Banner
          text={point.quotedAuthor.name}
          color={point.quotedAuthor.color}
          placement={{ top: "-0.15rem", right: "0.8rem" }}
          darkMode={props.darkMode}
        />
      )}
    </StyledSpan>
  );
};

interface StyledProps {
  isMainPoint?: boolean;
  isDragging?: boolean;
  isFirst?: boolean;
  isSelected?: boolean;
  quotedAuthor?: AuthorI;
  darkMode?: boolean;
}

const StyledSpan = styled.span<StyledProps>`
  position: relative;
  left: 2px;
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  padding-top: ${(props) => (props.isFirst ? "1px" : "0px")};
  margin-right: 4px;
  ${(props) =>
    props.quotedAuthor &&
    `padding: 0.3rem 0.8rem 0.2rem 0.2rem;
   `}
  ${(props) =>
    props.isSelected &&
    `                                                                  
  background-color: #777;                                          
  border-radius: 5px;
`}
`;

const StyledImg = styled.img<StyledProps>`
  position: absolute;
  top: ${(props) => (props.isMainPoint ? 0 : "2px")};
  margin-top: ${(props) => (props.quotedAuthor ? "0.8rem" : 0)};
  left: ${(props) => (props.quotedAuthor ? "7px" : 0)};
  opacity: 0.7;
`;

const StyledTextArea = styled(TextareaAutosize)<StyledProps>`
  width: 100%;
  border: 0;
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};
  background-color: transparent;
  font-family: arial;
  font-size: ${(props) => (props.isMainPoint ? "medium" : "small")};
  font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
  outline: 0;
  resize: none;
  overflow: hidden;
  text-indent: ${(props) => (props.isMainPoint ? "1.6em" : "1.4em")};
  ${(props) =>
    props.quotedAuthor &&
    ` border: 1.5px solid ${props.quotedAuthor.color}; border-top: 0.5rem solid ${props.quotedAuthor.color}; border-radius: 3px; padding: 3px 0 3px 3px;`}
`;

const mapStateToProps = () => {
  return {};
};

const mapActionsToProps = {
  splitIntoTwoPoints,
  combinePoints,
  setCursorPosition,
  clearCursorPosition,
  pointMove,
  pointUpdate,
  setMainPoint,
  setExpandedRegion,
  togglePoint,
  setSelectedPoints,
  pointsDelete,
};

export default connect(mapStateToProps, mapActionsToProps)(Point);
