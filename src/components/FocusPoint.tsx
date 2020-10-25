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
import { AuthorI, PointI, PointReferenceI } from "../dataModels/dataModels";
import { getPointById, getReferenceData } from "../dataModels/getters";
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
import { setMainPoint, SetMainPointParams } from "../actions/messagesActions";

interface OwnProps {
  pointId: string;
  onClick: (e: React.MouseEvent) => void;
  readOnlyOverride: boolean;
  isMainPoint: boolean;
  isSelected: boolean;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  referenceData: PointReferenceI | null;
  referenceAuthor?: AuthorI;
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

  const onClickShapeIcon = () => {
    if (!props.readOnlyOverride) {
      props.setMainPoint({ pointId });
    }
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const { drag, preview } = useDragPoint(pointId, 0);

  return (
    <StyledSpan
      onClick={props.onClick}
      ref={preview}
      isMainPoint={isMainPoint}
      isSelected={props.isSelected}
      referenceAuthor={props.referenceAuthor}
    >
      <StyledImg
        ref={props.readOnlyOverride ? null : drag}
        src={imageUrl}
        onClick={onClickShapeIcon}
        isMainPoint={props.isMainPoint}
        referenceAuthor={props.referenceAuthor}
        darkMode={props.darkMode}
        alt={shape}
      />
      <StyledTextArea
        value={point.content}
        onChange={handleChange}
        onBlur={() => {
          if (!point.content) props.pointsDelete({ pointIds: [point._id] });
        }}
        readOnly={!!props.referenceAuthor || props.readOnlyOverride}
        isMainPoint={isMainPoint}
        referenceAuthor={props.referenceAuthor}
        darkMode={props.darkMode}
        autoFocus
        onKeyDown={(e: React.KeyboardEvent) => {
          if (props.readOnlyOverride) {
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
  };
};

const mapActionsToProps = {
  pointUpdate,
  setMainPoint,
  pointsDelete,
};

export default connect(mapStateToProps, mapActionsToProps)(FocusPoint);
