/* Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React from "react";
import { PointI } from "../dataModels/dataModels";
import { getPointById } from "../dataModels/getters";
import { useDragPoint } from "../hooks/useDragPoint";
import { StyledImg, StyledSpan, StyledTextArea } from "./StyledPoint";
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
      onClick={handleClick}
      ref={preview}
      isMainPoint={isMainPoint}
      isDragging={isDragging}
      isSelected={props.isSelected}
      quotedAuthor={point.quotedAuthor}
    >
      <StyledImg
        ref={props.readOnly ? null : drag}
        src={imageUrl}
        onClick={onClickShapeIcon}
        isMainPoint={props.isMainPoint}
        quotedAuthor={point.quotedAuthor}
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
        isMainPoint={isMainPoint}
        quotedAuthor={point.quotedAuthor}
        darkMode={props.darkMode}
        autoFocus
        onKeyDown={(e: React.KeyboardEvent) => {
          if (props.readOnly) {
            return;
          } else {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }
        }}
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

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  point: getPointById(ownProps.pointId, state.points),
});

const mapActionsToProps = {
  pointUpdate,
  setMainPoint,
  togglePoint,
  setSelectedPoints,
  pointsDelete,
};

export default connect(mapStateToProps, mapActionsToProps)(FocusPoint);
