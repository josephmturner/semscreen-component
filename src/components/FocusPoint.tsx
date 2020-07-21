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
import { PointI, PointShape } from "../constants/AppState";

import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

const FocusPoint = (props: {
  point: PointI;
  shape: PointShape;
  appDispatch: any;
  isEditing: boolean;
  onEnterPress: any;
  onClick: any;
}) => {
  const {
    point,
    shape,
    appDispatch,
    isEditing,
    onEnterPress,
    onClick,
  } = props;

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    isEditing && ref.current && ref.current.focus();
  }, [isEditing]);

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
    <StyledSpan onClick={handleClick}>
      <StyledImg src={imageUrl} alt={shape} />
      <StyledTextArea
        value={point.content}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={() => {
          appDispatch({
            type: "setEditingPoint",
            pointId: point.pointId,
          });
        }}
        ref={ref}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnterPress();
          }
        }}
      />
    </StyledSpan>
  );
};

const StyledImg = styled.img`
  height: 20px;
  margin: auto;
  opacity: 0.7;
`;

interface StyledProps {
}

const StyledSpan = styled.span<StyledProps>`
  margin: auto;
  display: flex;
`;

const StyledTextArea = styled(TextareaAutosize)<StyledProps>`
  width: 100%;
  border: 0px;
  background-color: transparent;
  font-family: ubuntu;
  outline: 0;
  resize: none;
`;

export default FocusPoint;
