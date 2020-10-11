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
import { AuthorI, PointI } from "../dataModels";
import { useDragPoint } from "../hooks/useDragPoint";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import Banner from "./Banner";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  pointUpdate,
  PointUpdateParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/pointsActions";
import { setMainPoint, SetMainPointParams } from "../actions/messageActions";
import {
  setSelectedPoints,
  SetSelectedPointsParams,
  togglePoint,
  TogglePointParams,
} from "../actions/selectPointActions";

interface OwnProps {
  pointId: string;
  readOnly: boolean;
  isExpanded: "expanded" | "minimized" | "balanced";
  isMainPoint: boolean;
  isSelected: boolean;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
}

const FocusPoint = (props: AllProps) => {
  const { point, pointId, isMainPoint } = props;
  const shape = point.shape;

  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }
    if (e.ctrlKey) {
      props.togglePoint({ pointId });
    } else {
      props.setSelectedPoints({ pointIds: [] });
    }
  };

  const onClickShapeIcon = () => {
    if (!props.readOnly) {
      props.setMainPoint({ pointId });
    }
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const { isDragging, drag, preview } = useDragPoint(point);

  return (
    <StyledSpan
      ref={preview}
      onClick={handleClick}
      isMainPoint={isMainPoint}
      isDragging={isDragging}
      isSelected={props.isSelected}
      quotedAuthor={point.quotedAuthor}
    >
      <StyledImg
        ref={props.readOnly ? null : drag}
        src={imageUrl}
        onClick={onClickShapeIcon}
        quotedAuthor={point.quotedAuthor}
        height={isMainPoint ? 30 : 20}
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
        autoFocus
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
  ${(props) =>
    props.isSelected &&
    `                                                                  
  background-color: #777;                                          
  border-radius: 5px;
`}
`;

const StyledImg = styled.img<StyledProps>`
  height: 20px;
  margin: auto;
  opacity: 0.7;
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

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  point: state.points.byId[ownProps.pointId],
});

const mapActionsToProps = {
  pointUpdate,
  setMainPoint,
  togglePoint,
  setSelectedPoints,
  pointsDelete,
};

export default connect(mapStateToProps, mapActionsToProps)(FocusPoint);
