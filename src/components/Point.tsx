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
import { PointI, PointShape } from "../dataModels";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";

import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

import { connect } from "react-redux";
import { setEditingPoint } from "../actions/editingPointActions";
import { Details as CursorPositionDetails } from '../reducers/cursorPosition';
import { setCursorPosition } from '../actions/cursorPositionActions';
import {
  pointMove,
  PointMoveParams,
  pointUpdate,
  PointUpdateParams,
  setMainPoint,
  SetMainPointParams,
} from '../actions/messageActions';

const Point = (props: {
  point: PointI;
  shape: PointShape;
  isExpanded: "expanded" | "minimized" | "balanced";
  setExpandedRegion: any;
  isMainPoint: boolean;
  index: number;
  isEditing: boolean;
  createPointBelow: (topContent: string, bottomContent: string) => void;
  combinePoints: (
    aboveOrBelow: "above" | "below",
    point: PointI,
    shape: PointShape,
    index: number
  ) => void;
  cursorPositionIndex: number | undefined;
  setCursorPosition: (index: number, moveTo: string) => void;
  onClick: any;
  setEditingPoint: (pointId: string) => void;
  setCursorPositionRedux: (details: CursorPositionDetails | null) => void;
  pointMove: (params: PointMoveParams) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
}) => {
  const {
    point,
    shape,
    isExpanded,
    setExpandedRegion,
    isMainPoint,
    index,
    isEditing,
    createPointBelow,
    combinePoints,
    cursorPositionIndex,
    setCursorPosition,
    onClick,
    setEditingPoint,
    setCursorPositionRedux,
  } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover(item: DraggablePointType, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      if (isExpanded !== "expanded") {
        setExpandedRegion(shape);
      }
      //TODO: only call the following logic after the animation transition ends.
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

  useEffect(() => {
    isEditing && ref.current && ref.current.focus();
  }, [isEditing]);

  const pointRef = useRef<HTMLSpanElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.POINT,
      pointId: point.pointId,
      originalShape: shape,
      originalIndex: index,
      shape: shape,
      index: index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => {
      return point.pointId === monitor.getItem().pointId;
    },
  });

  drop(preview(pointRef));

  useEffect(() => {
    if (!isNaN(cursorPositionIndex as number) && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        cursorPositionIndex as number,
        cursorPositionIndex as number
      );
      setCursorPositionRedux(null);
    }
  }, [cursorPositionIndex, setCursorPositionRedux]);

  const [arrowPressed, setArrowPressed] = useState<
    "ArrowUp" | "ArrowDown" | undefined
  >(undefined);
  useEffect(() => {
    if (arrowPressed === "ArrowUp" && ref.current) {
      ref.current &&
        ref.current.selectionStart === 0 &&
        setCursorPosition(index, "beginningOfPriorPoint");
    } else if (arrowPressed === "ArrowDown" && ref.current) {
      ref.current &&
        ref.current.selectionStart === point.content.length &&
        setCursorPosition(index, "beginningOfNextPoint");
    }
    setArrowPressed(undefined);
  }, [arrowPressed, index, point.content.length, setCursorPosition]);

  const handleChange = (e: any) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
      shape: shape,
    });
  };

  const handleBlur = () => {
    setEditingPoint("");
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  const imageUrl = require(`../images/${shape}.svg`);

  return (
    <StyledSpan
      ref={pointRef}
      isEditing={isEditing}
      isMainPoint={isMainPoint}
      isDragging={isDragging}
      isFirst={index === 0 ? true : false}
      onClick={handleClick}
    >
      <StyledDiv>
        <StyledImg
          ref={drag}
          src={imageUrl}
          onClick={() => {
            isMainPoint
              ? props.setMainPoint({ pointId: "" })
              : props.setMainPoint({ pointId: point.pointId });
          }}
          isMainPoint={isMainPoint}
          height={isMainPoint ? 23 : 17}
          alt={shape}
        />
        <StyledTextArea
          value={point.content}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={() => {
            setEditingPoint(point.pointId);
          }}
          isMainPoint={isMainPoint}
          ref={ref}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ref.current &&
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
                combinePoints("above", point, shape, index);
              } else if (index === 0 && !point.content) {
                e.preventDefault();
                combinePoints("below", point, shape, index);
              }
            } else if (
              e.key === "Delete" &&
              ref.current &&
              ref.current.selectionStart === point.content.length &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              e.preventDefault();
              combinePoints("below", point, shape, index);
            } else if (
              e.key === "ArrowLeft" &&
              ref.current &&
              ref.current.selectionStart === 0 &&
              ref.current.selectionStart === ref.current.selectionEnd &&
              index !== 0
            ) {
              e.preventDefault();
              setCursorPosition(index, "endOfPriorPoint");
            } else if (
              e.key === "ArrowRight" &&
              ref.current &&
              ref.current.selectionStart === point.content.length &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              e.preventDefault();
              setCursorPosition(index, "beginningOfNextPoint");
            } else if (e.key === "ArrowUp" && index !== 0) {
              setArrowPressed("ArrowUp");
            } else if (e.key === "ArrowDown") {
              setArrowPressed("ArrowDown");
            }
          }}
        />
      </StyledDiv>
    </StyledSpan>
  );
};

interface StyledProps {
  isEditing?: boolean;
  isMainPoint?: boolean;
  isDragging?: boolean;
  isFirst?: boolean;
}

const StyledDiv = styled.div<StyledProps>`
  position: relative;
  left: 2px;
`;

const StyledSpan = styled.span<StyledProps>`
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  padding-top: ${(props) => (props.isFirst ? "1px" : "0px")};
  ${(props) =>
    props.isEditing &&
    `
  background-color: #efefef;
  border-radius: 5px;
`}
`;

const StyledImg = styled.img<StyledProps>`
  position: absolute;
  top: ${(props) => (props.isMainPoint ? 0 : "2px")};
  opacity: 0.7;
`;

const StyledTextArea = styled(TextareaAutosize)<StyledProps>`
  width: 100%;
  border: 0px;
  padding: 0;
  background-color: transparent;
  top: ${(props) => (props.isMainPoint ? "20px" : "0px")};
  font-family: arial;
  font-size: ${(props) => (props.isMainPoint ? "medium" : "small")};
  font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
  outline: 0;
  resize: none;
  overflow: hidden;
  text-indent: ${(props) => (props.isMainPoint ? "1.6em" : "1.4em")};
`;

// export default Point;

const mapStateToProps = () => {};
const mapActionsToProps = {
  setEditingPoint,
  setCursorPositionRedux: setCursorPosition,
  pointMove,
  pointUpdate,
  setMainPoint,
};

export default connect(mapStateToProps, mapActionsToProps)(Point);
