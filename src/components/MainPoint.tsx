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
import React, { useRef } from "react";
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import {
  getPointIfReference,
  getReferenceData,
} from "../dataModels/pointUtils";
import { useDragPoint } from "../hooks/useDragPoint";
import Point from "./Point";
import PointHoverOptions from "./PointHoverOptions";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  pointUpdate,
  PointUpdateParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/draftPointsActions";
import { setMain, SetMainParams } from "../actions/draftMessagesActions";
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
  isSelected: boolean;
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  referenceData: PointReferenceI | null;
  isDraft: boolean;
  pointUpdate: (params: PointUpdateParams) => void;
  setMain: (params: SetMainParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
}

const MainPoint = (props: AllProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!props.isDraft) {
      return;
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...props.point, content: e.target.value },
    });
  };

  const handleShapeIconClick = (e: React.MouseEvent) => {
    props.togglePoint({ pointId: props.pointId });
    e.stopPropagation();
  };

  const handlePointDivClick = (e: React.MouseEvent) => {
    if (props.isExpanded) {
      e.stopPropagation();
    }

    props.setSelectedPoints({ pointIds: [] });
  };

  const handleBlur = () => {
    if (!props.point.content) props.pointsDelete({ pointIds: [props.pointId] });
  };

  const { drag, preview } = useDragPoint(props.pointId, 0);

  //TODO: fix ref type
  const pointRef = useRef<any>(null);

  drag(pointRef.current?.img);
  preview(pointRef.current?.div);

  return (
    <Point
      id={props.pointId}
      displayPoint={props.point}
      referenceData={props.referenceData}
      isMainPoint={true}
      isSelected={props.isSelected}
      isHovered={props.isHovered}
      setIsHovered={props.setIsHovered}
      readOnlyOverride={!props.isDraft}
      darkMode={props.darkMode}
      handleChange={handleChange}
      handleKeyDown={handleKeyDown}
      handleBlur={handleBlur}
      handlePointDivClick={handlePointDivClick}
      handleShapeIconClick={handleShapeIconClick}
      ref={pointRef}
    >
      {props.isHovered && props.isDraft && (
        <PointHoverOptions
          type={"point"}
          id={props.pointId}
          darkMode={props.darkMode}
          isSelected={props.isSelected}
        />
      )}
    </Point>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const referenceData = getReferenceData(ownProps.pointId, state);

  return {
    point: getPointIfReference(ownProps.pointId, state),
    referenceData,
    isDraft: state.draftMessages.allIds.includes(
      state.semanticScreen.currentMessage
    ),
  };
};

const mapActionsToProps = {
  pointUpdate,
  setMain,
  pointsDelete,
  togglePoint,
  setSelectedPoints,
  setCurrentMessage,
};

export default connect(mapStateToProps, mapActionsToProps)(MainPoint);
