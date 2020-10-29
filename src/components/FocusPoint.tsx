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
import React, { useState } from "react";
import { AuthorI, PointI, PointReferenceI } from "../dataModels/dataModels";
import { getPointById, getReferenceData } from "../dataModels/getters";
import { useDragPoint } from "../hooks/useDragPoint";
import { StyledImg, StyledSpan, StyledTextArea } from "./StyledPoint";
import Banner from "./Banner";
import PointHoverOptions from "./PointHoverOptions";
import { MainPointShape } from "./MainPointShape";

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
  isExpanded: "expanded" | "minimized" | "balanced";
  isMainPoint: boolean;
  isSelected: boolean;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  referenceData: PointReferenceI | null;
  referenceAuthor?: AuthorI;
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
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }

    //TODO: Is there a more correct way to do this? I want to switch
    //to the referenced message and then select the point whose
    //reference I clicked.
    //Perhaps we should pass an optional referencePointId to the
    //setCurrentMessage dispatch, which selects that point if it's
    //passed in?
    if (props.referenceData) {
      props.setCurrentMessage({
        messageId: props.referenceData.referenceMessageId,
      });
      props.setSelectedPoints({
        pointIds: [props.referenceData.referencePointId],
      });
    } else {
      props.setSelectedPoints({ pointIds: [] });
    }
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const { drag, preview } = useDragPoint(pointId, 0);

  return (
    <StyledSpan
      onClick={handlePointSpanClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={preview}
      isMainPoint={isMainPoint}
      isSelected={props.isSelected}
      referenceAuthor={props.referenceAuthor}
    >
      {props.isMainPoint ? (
        <MainPointShape
          shape={shape}
          referenceAuthor={props.referenceAuthor}
          darkMode={props.darkMode}
          onClick={handleShapeIconClick}
        />
      ) : (
        <StyledImg
          ref={props.isPersisted ? null : drag}
          src={imageUrl}
          onClick={handleShapeIconClick}
          isMainPoint={props.isMainPoint}
          referenceAuthor={props.referenceAuthor}
          darkMode={props.darkMode}
          alt={shape}
        />
      )}
      <StyledTextArea
        value={point.content}
        onChange={handleChange}
        onBlur={() => {
          if (!point.content) props.pointsDelete({ pointIds: [point._id] });
        }}
        readOnly={!!props.referenceAuthor || props.isPersisted}
        isMainPoint={isMainPoint}
        referenceAuthor={props.referenceAuthor}
        darkMode={props.darkMode}
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
      {props.referenceData && (
        <Banner
          authorId={props.referenceData.referenceAuthorId}
          placement={{ top: "-0.5rem", right: "0.4rem" }}
          darkMode={props.darkMode}
        />
      )}
      {isHovered && !props.isPersisted && (
        <PointHoverOptions pointId={pointId} darkMode={props.darkMode} />
      )}
    </StyledSpan>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const referenceData = getReferenceData(ownProps.pointId, state.points);
  let referenceAuthor;
  if (referenceData) {
    referenceAuthor = state.authors.byId[referenceData.referenceAuthorId];
  }
  return {
    point: getPointById(ownProps.pointId, state.points),
    referenceData,
    referenceAuthor,
    isPersisted:
      state.messages.byId[state.semanticScreen.currentMessage].isPersisted,
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
