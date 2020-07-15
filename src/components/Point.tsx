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
import { PointI } from "../constants/AppState";
import { ItemTypes } from "../constants/React-Dnd";

import { useDrag } from "react-dnd";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

const Point = (props: {
  point: PointI;
  isMainPoint: boolean;
  index: number;
  appDispatch: any;
  isEditing: boolean;
  createPointBelow: (topContent: string, bottomContent: string) => void;
  combinePoints: (
    aboveOrBelow: "above" | "below",
    point: PointI,
    index: number
  ) => void;
  cursorPositionIndex: number | undefined;
  setCursorPosition: (index: number, moveTo: string) => void;
  onClick: any;
}) => {
  const {
    point,
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

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    isEditing && ref.current && ref.current.focus();
  }, [isEditing]);

  const [{ isDragging }, pointRef] = useDrag({
    item: { type: ItemTypes.POINT, point: point, index: index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;

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

  const handleChange = (e: any) => { appDispatch({
      type: "pointUpdate",
      point: { ...point, content: e.target.value },
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

  const imageUrl = require(`../images/${point.shape}.svg`);

  return (
    <StyledSpan
      ref={pointRef}
      isEditing={isEditing}
      isMainPoint={isMainPoint}
      opacity={opacity}
      onClick={handleClick}
    >
      <StyledImg
        src={imageUrl}
        onClick={() =>
          appDispatch({ type: "setMainPoint", pointId: point.pointId })
        }
        height={isMainPoint ? 30 : 20}
        alt={point.shape}
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
            ref.current.selectionStart === ref.current.selectionEnd &&
            index !== 0
          ) {
            e.preventDefault();
            combinePoints("above", point, index);
          } else if (
            e.key === "Delete" &&
            ref.current &&
            ref.current.selectionStart === point.content.length &&
            ref.current.selectionStart === ref.current.selectionEnd
          ) {
            e.preventDefault();
            combinePoints("below", point, index);
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
  opacity: number;
}

//TODO: replace background-color below with props.color when author
//styles are ready
const StyledSpan = styled.span<StyledSpanProps>`
  display: flex;
  opacity: ${(props) => props.opacity};
  ${(props) =>
    props.isEditing &&
    `
  background-color: lightgray;
  margin: 2px 0;
  outline: 2px solid #707070;
`}

  ${(props) =>
    props.isMainPoint &&
    `
  border-top: solid #4f4f4f;
  border-bottom: solid #4f4f4f;
  margin: 1% 0;
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
