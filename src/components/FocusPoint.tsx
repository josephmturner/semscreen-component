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
import React, { useRef } from "react";
import { AuthorI, PointI, PointShape } from "../dataModels";
import { useDragPoint } from "../hooks/useDragPoint";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import Banner from "./Banner";

import { connect } from "react-redux";
import {
  pointUpdate,
  PointUpdateParams,
  setMainPoint,
  SetMainPointParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/messageActions";
import { togglePoint, TogglePointParams } from "../actions/selectPointActions";

const FocusPoint = (props: {
  point: PointI;
  shape: PointShape;
  index: number;
  readOnly: boolean;
  isExpanded: "expanded" | "minimized" | "balanced";
  darkMode: boolean;
  isMainPoint: boolean;
  isSelected: boolean;
  togglePoint: (params: TogglePointParams) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
}) => {
  const { point, shape, index, isMainPoint } = props;

  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
      shape: shape,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }
  };

  const onClickShapeIcon = () => {
    props.togglePoint({ pointId: point._id });
  };

  const onDoubleClickShapeIcon = () => {
    if (props.readOnly) {
      return;
    } else {
      props.isMainPoint
        ? props.setMainPoint({ pointId: "" })
        : props.setMainPoint({ pointId: point._id });
    }
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const { isDragging, drag, preview } = useDragPoint(point, shape, index);

  return (
    <StyledSpan
      ref={preview}
      onClick={handleClick}
      isMainPoint={isMainPoint}
      isDragging={isDragging}
      quotedAuthor={point.quotedAuthor}
    >
      <StyledImg
        ref={props.readOnly ? null : drag}
        src={imageUrl}
        onClick={onClickShapeIcon}
        onDoubleClick={onDoubleClickShapeIcon}
        quotedAuthor={point.quotedAuthor}
        height={isMainPoint ? 30 : 20}
        isSelected={props.isSelected}
        darkMode={props.darkMode}
        alt={shape}
      />
      <StyledTextArea
        value={point.content}
        onChange={handleChange}
        onBlur={() => {
          if (!point.content) props.pointsDelete({ pointIds: [point._id] });
        }}
        readOnly={!!point.quotedAuthor || props.readOnly}
        ref={ref}
        autoFocus={true}
        isMainPoint={isMainPoint}
        quotedAuthor={point.quotedAuthor}
        darkMode={props.darkMode}
      />
      {point.quotedAuthor && (
        <Banner
          text={point.quotedAuthor.name}
          color={point.quotedAuthor.color}
          placement={{ top: "-0.5rem", right: "0.4rem" }}
          darkMode={props.darkMode}
        />
      )}
    </StyledSpan>
  );
};

interface StyledProps {
  isMainPoint?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  quotedAuthor?: AuthorI;
  darkMode?: boolean;
}

const StyledSpan = styled.span<StyledProps>`
  position: relative;
  margin: auto;
  display: flex;
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};

  ${(props) =>
    props.isMainPoint &&
    `
  padding: 1% 0;
`};
`;

const StyledImg = styled.img<StyledProps>`
  height: 20px;
  margin: auto;
  opacity: 0.7;
  ${(props) =>
    props.isSelected &&
    `
border: 2px solid ${props.darkMode ? "white" : "black"};
border-radius: 5px;
`}
`;

const StyledTextArea = styled(TextareaAutosize)<StyledProps>`
  width: 100%;
  border: 0px;
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};
  background-color: transparent;
  font-family: arial;
  font-size: medium;
  font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
  outline: 0;
  resize: none;
  ${(props) =>
    props.quotedAuthor &&
    ` border: 1.5px solid ${props.quotedAuthor.color}; border-top: 0.5rem solid ${props.quotedAuthor.color}; border-radius: 3px; padding: 3px 0 3px 3px;`}
`;

const mapStateToProps = () => {
  return {};
};

const mapActionsToProps = {
  pointUpdate,
  setMainPoint,
  togglePoint,
  pointsDelete,
};

export default connect(mapStateToProps, mapActionsToProps)(FocusPoint);
