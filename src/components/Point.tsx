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
import React, { useEffect, useRef } from "react";
import Button from "./Button";
import { PointI } from "../constants/AppState";

import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

const Point = (props: {
  point: PointI;
  index: number;
  appDispatch: any;
  isEditing: boolean;
  createPointBelow: (topContent: string, bottomContent: string) => void;
  combineWithPriorPoint: (point: PointI, index: number) => void;
  //TODO: why do I have to include false as a possible type?
  setCursorPositionIndex: number | undefined | false;
  onClick: any;
}) => {
  const {
    point,
    index,
    appDispatch,
    isEditing,
    createPointBelow,
    combineWithPriorPoint,
    setCursorPositionIndex,
    onClick,
  } = props;

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    isEditing && ref.current && ref.current.focus();
  }, [isEditing]);

  //TODO: is there a better way to handle the falsiness of 0
  //(currently, I am using a ternary operator in Region when I pass
  //setCursorPositionIndex to Point and then belwo in the useEffect
  useEffect(() => {
    console.log(setCursorPositionIndex);
    if (!isNaN(setCursorPositionIndex as number) && ref.current) {
      console.log(setCursorPositionIndex);
      ref.current.focus();
      ref.current.setSelectionRange(
        setCursorPositionIndex as number,
        setCursorPositionIndex as number
      );
      appDispatch({ type: "resetCursorPosition" });
    }
  }, [setCursorPositionIndex, appDispatch]);

  const handleChange = (e: any) => {
    appDispatch({
      type: "pointUpdate",
      point: { ...point, content: e.target.value },
    });
  };

  const handleBlur = () => {
    appDispatch({
      type: "noEditingPoint",
    });
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };
  const handleDelete = () => {
    appDispatch({
      type: "pointsDelete",
      pointIds: [point.pointId],
    });
  };

  const imageUrl = require(`../images/${point.shape}.svg`);

  return (
    <StyledSpan onClick={handleClick}>
      <StyledImg src={imageUrl} alt={point.shape} />
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
            combineWithPriorPoint(point, index);
          }
        }}
      />
      <Button type="button" onClick={handleDelete} />
    </StyledSpan>
  );
};

const StyledImg = styled.img`
  height: 20px;
  margin: 0px 4px 0 3px;
  opacity: 0.7;
`;

const StyledSpan = styled.span`
  display: flex;
`;

const StyledTextArea = styled(TextareaAutosize)`
  width: 100%;
  border: 0px;
  background-color: transparent;
  font-family: ubuntu;
  outline: 0;
  resize: none;
`;

export default Point;
