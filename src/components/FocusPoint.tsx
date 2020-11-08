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
import React, { useRef, useState } from "react";
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import {
  getPointById,
  getReferenceData,
  getOriginalMessageId,
  getOriginalPointId,
  getOriginalAuthorId,
} from "../dataModels/pointUtils";
import { useDragPoint } from "../hooks/useDragPoint";
import { StyledImg, StyledSpan, StyledTextArea } from "./StyledPoint";
import Banner from "./Banner";
import PointHoverOptions from "./PointHoverOptions";
import { MainPointShape } from "./MainPointShape";
import { useTextareaIndent } from "../hooks/useTextareaIndent";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  pointUpdate,
  PointUpdateParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/pointsActions";
import { setMainPoint, SetMainPointParams } from "../actions/messagesActions";
import {
  setSelectedPoints,
  SetSelectedPointsParams,
  togglePoint,
  TogglePointParams,
} from "../actions/selectPointActions";
import {
  setCurrentMessage,
  SetCurrentMessageParams,
} from "../actions/semanticScreenActions";

interface OwnProps {
  pointId: string;
  isExpanded: boolean;
  isMainPoint: boolean;
  isSelected: boolean;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  referenceData: PointReferenceI | null;
  isPersisted: boolean;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
}

const FocusPoint = (props: AllProps) => {
  const { point, pointId, isMainPoint } = props;
  const shape = point.shape;

  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
    });
  };

  const handleShapeIconClick = (e: React.MouseEvent) => {
    props.togglePoint({ pointId });
    e.stopPropagation();
  };

  const handlePointSpanClick = (e: React.MouseEvent) => {
    if (props.isExpanded) {
      e.stopPropagation();
    }

    if (props.referenceData) {
      props.setCurrentMessage({
        messageId: getOriginalMessageId(props.referenceData),
        selectedPointIds: [getOriginalPointId(props.referenceData)],
      });
    } else {
      props.setSelectedPoints({ pointIds: [] });
    }
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const { drag, preview } = useDragPoint(pointId, 0);

  const spanRef = useRef<HTMLSpanElement>(null);

  preview(spanRef);

  const bannerRef = useRef<HTMLDivElement>(null);

  const { textareaIndent, textareaNewline } = useTextareaIndent(
    spanRef,
    bannerRef
  );

  return (
    <StyledSpan
      onClick={handlePointSpanClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={spanRef}
      isMainPoint={isMainPoint}
      isSelected={props.isSelected}
      darkMode={props.darkMode}
    >
      {props.isMainPoint ? (
        <MainPointShape
          shape={shape}
          darkMode={props.darkMode}
          onClick={handleShapeIconClick}
        />
      ) : (
        <StyledImg
          ref={drag}
          src={imageUrl}
          onClick={handleShapeIconClick}
          isMainPoint={props.isMainPoint}
          darkMode={props.darkMode}
          alt={shape}
        />
      )}
      {props.referenceData && (
        <Banner
          authorId={getOriginalAuthorId(props.referenceData)}
          placement={{ top: "0.1rem", left: "2.2em" }}
          darkMode={props.darkMode}
          ref={bannerRef}
        />
      )}
      <StyledTextArea
        value={point.content}
        onChange={handleChange}
        onBlur={() => {
          if (!point.content) props.pointsDelete({ pointIds: [point._id] });
        }}
        readOnly={!!props.referenceData || props.isPersisted}
        isMainPoint={isMainPoint}
        darkMode={props.darkMode}
        indent={textareaIndent}
        newLine={textareaNewline}
        autoFocus
        onKeyDown={(e: React.KeyboardEvent) => {
          if (props.isPersisted) {
            return;
          } else {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }
        }}
      />
      {isHovered && !props.isPersisted && (
        <PointHoverOptions pointId={pointId} darkMode={props.darkMode} />
      )}
    </StyledSpan>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const referenceData = getReferenceData(ownProps.pointId, state.points);

  return {
    point: getPointById(ownProps.pointId, state.points),
    referenceData,
    isPersisted: !state.messages.draftIds.includes(
      state.semanticScreen.currentMessage
    ),
  };
};

const mapActionsToProps = {
  pointUpdate,
  setMainPoint,
  pointsDelete,
  togglePoint,
  setSelectedPoints,
  setCurrentMessage,
};

export default connect(mapStateToProps, mapActionsToProps)(FocusPoint);
