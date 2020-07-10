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
import Button from "./Button";
import { PointI } from "../constants/AppState";

import styled from "styled-components";

const FocusPoint = (props: {
  point: PointI;
  appDispatch: any;
  isEditing: boolean;
  onEnterPress: any;
  onClick: any;
}) => {
  const { point, appDispatch, isEditing, onEnterPress, onClick } = props;

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    isEditing && ref.current && ref.current.focus();
  }, [isEditing]);

  const [content, setContent] = useState(point.content);
  useEffect(() => {
    setContent(point.content);
  }, [point.content]);

  const handleChange = (e: any) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    appDispatch({
      type: "pointUpdate",
      point: { ...point, content: content },
    });
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
        value={content}
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
            onEnterPress();
          }
        }}
      />
      <Button type="button" onClick={handleDelete} />
    </StyledSpan>
  );
};

const StyledImg = styled.img`
  height: 40px;
  margin: auto;
  opacity: 0.7;
`;

const StyledSpan = styled.span`
  display: flex;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  border: 0px;
  background-color: transparent;
  font-family: ubuntu;
  outline: 0;
  resize: none;
`;

export default FocusPoint;
