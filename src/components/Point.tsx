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
import { PointI, PointShape } from "../constants/AppState";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";

import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

const Point = (props: {
  point: PointI;
  shape: PointShape;
  isExpanded: "expanded" | "minimized" | "balanced";
  setExpandedRegion: any;
  isMainPoint: boolean;
  index: number;
  appDispatch: any;
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
}) => {
  const {
    point,
    shape,
    isExpanded,
    setExpandedRegion,
    isMainPoint,
    index,
    appDispatch,
    isEditing,
    createPointBelow,
    combinePoints,
    cursorPositionIndex,
    setCursorPosition,
    onClick,
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

      appDispatch({
        type: "pointMove",
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

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.POINT,
      pointId: point.pointId,
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

  drag(drop(pointRef));

  useEffect(() => {
    if (!isNaN(cursorPositionIndex as number) && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        cursorPositionIndex as number,
        cursorPositionIndex as number
      );
      appDispatch({ type: "resetCursorPosition" });
    }
  }, [cursorPositionIndex, appDispatch]);

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
    appDispatch({
      type: "pointUpdate",
      point: { ...point, content: e.target.value },
      shape: shape,
    });
  };

  const handleBlur = () => {
    appDispatch({
      type: "setEditingPoint",
      editingPoint: undefined,
    });
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
      <StyledImg
        src={imageUrl}
        onClick={() => {
          isMainPoint
            ? appDispatch({ type: "setMainPoint", pointId: "" })
            : appDispatch({ type: "setMainPoint", pointId: point.pointId });
        }}
        height={isMainPoint ? 30 : 20}
        alt={shape}
      />
      <StyledTextArea
        value={point.content}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={() =>
          appDispatch({
            type: "setEditingPoint",
            pointId: point.pointId,
          })
        }
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
    </StyledSpan>
  );
};

interface StyledSpanProps {
  isEditing: boolean;
  isMainPoint: boolean;
  isDragging: boolean;
  isFirst: boolean;
}

//TODO: replace background-color below with props.color when author
//styles are ready
const StyledSpan = styled.span<StyledSpanProps>`
  display: flex;
  margin: 0 0.1em;
  margin-top: ${(props) => (props.isFirst ? "0.2em" : 0)};
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  ${(props) =>
    props.isEditing &&
    `
  background-color: lightgray;
  border-radius: 5px;
`}

  ${(props) =>
    props.isMainPoint &&
    `
  border-top: solid #4f4f4f;
  border-bottom: solid #4f4f4f;
  padding: 1% 0;
`}
`;

const StyledImg = styled.img`
  margin: 0px 4px 0 3px;
  opacity: 0.7;
`;

const StyledTextArea = styled(TextareaAutosize)`
  width: 100%;
  border: 0px;
  background-color: transparent;
  font-family: ubuntu;
  font-size: small;
  outline: 0;
  resize: none;
`;

export default Point;
