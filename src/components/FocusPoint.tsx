/* Copyright (C) 2020 by USHIN, Inc.

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
import { PointI, PointShape } from "../dataModels";
import { ItemTypes } from "../constants/React-Dnd";
import { useDrag } from "react-dnd";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

import { connect } from "react-redux";
import { setEditingPoint } from "../actions/editingPointActions";
import {
  pointUpdate,
  PointUpdateParams,
  setMainPoint,
  SetMainPointParams,
} from '../actions/messageActions';

const FocusPoint = (props: {
  point: PointI;
  shape: PointShape;
  index: number;
  isMainPoint: boolean;
  isEditing: boolean;
  onEnterPress: any;
  onClick: any;
  setEditingPoint: (pointId: string) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
}) => {
  const {
    point,
    shape,
    index,
    isMainPoint,
    isEditing,
    onEnterPress,
    onClick,
    setEditingPoint,
  } = props;

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    isEditing && ref.current && ref.current.focus();
  }, [isEditing]);

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

  return (
    <StyledSpan
      ref={preview}
      onClick={handleClick}
      isMainPoint={isMainPoint}
      isEditing={isEditing}
      isDragging={isDragging}
    >
      <StyledImg
        ref={drag}
        src={imageUrl}
        onClick={() => {
          isMainPoint
            ? props.setMainPoint({ pointId: "" })
            : props.setMainPoint({ pointId: point.pointId });
        }}
        height={isMainPoint ? 30 : 20}
        alt={shape}
      />
      <StyledTextArea
        value={point.content}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={() => {
          setEditingPoint(point.pointId);
        }}
        ref={ref}
        isMainPoint={isMainPoint}
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
  isMainPoint?: boolean;
  isEditing?: boolean;
  isDragging?: boolean;
}

const StyledSpan = styled.span<StyledProps>`
  margin: auto;
  display: flex;
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  ${(props) =>
    props.isEditing &&
    `
  background-color: #efefef;
  border-radius: 5px;
`}

  ${(props) =>
    props.isMainPoint &&
    `
  padding: 1% 0;
`};
`;

const StyledTextArea = styled(TextareaAutosize)<StyledProps>`
  width: 100%;
  border: 0px;
  background-color: transparent;
  font-family: arial;
  font-size: medium;
  font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
  outline: 0;
  resize: none;
`;

const mapStateToProps = () => {};

const mapActionsToProps = {
  setEditingPoint,
  pointUpdate,
  setMainPoint,
};

export default connect(mapStateToProps, mapActionsToProps)(FocusPoint);
