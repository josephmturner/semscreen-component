/*
  Copyright (C) 2020 by USHIN, Inc.

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
import MainPoint from "./MainPoint";
import { StyledRegion, InnerContainer } from "./StyledRegion";
import SevenShapes from "./SevenShapes";
import { PointShape, RegionI } from "../dataModels/dataModels";
import { getMessageById } from "../dataModels/pointUtils";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import { pointCreate, PointCreateParams } from "../actions/draftPointsActions";
import { setMain, SetMainParams } from "../actions/draftMessagesActions";
import {
  setExpandedRegion,
  ExpandedRegionParams,
} from "../actions/expandedRegionActions";
import {
  setSelectedPoints,
  SetSelectedPointsParams,
  togglePoint,
  TogglePointParams,
} from "../actions/selectPointActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";

interface OwnProps {
  region: RegionI;
  darkMode: boolean;
}

interface AllProps extends OwnProps {
  pointId: string | undefined;
  selectedPoints: string[];
  isDraft: boolean;
  isExpanded: boolean;
  setMain: (params: SetMainParams) => void;
  setExpandedRegion: (params: ExpandedRegionParams) => void;
  pointCreate: (params: PointCreateParams) => void;
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  hoverOver: (params: HoverOverParams) => void;
}

//TODO: don't pass region to CenterRegion, since its only ever the
//Center region
const CenterRegion = (props: AllProps) => {
  const { region, isExpanded, pointId } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      if (!isExpanded) {
        props.setExpandedRegion({ region });
      }
      if (item.index !== 0 || item.region !== "center") {
        props.hoverOver({
          index: 0,
          region: "center",
        });

        item.index = 0;
        item.region = "center";
      }
    },
    drop: () => {
      if (props.isDraft) {
        props.setMain({});
      }
    },
  });

  const createEmptyMain = (shape: PointShape) => {
    props.pointCreate({
      point: {
        content: "",
        shape,
      },
      index: 0,
      main: true,
    });
  };

  return (
    <StyledRegion
      onClick={() => props.setExpandedRegion({ region })}
      ref={drop}
    >
      <InnerContainer
        style={{
          //TODO: What styles should go here (and/or in StyledPoint
          //such that the textarea expands as its content grows,
          //always remaining centered and eventually filling the
          //width of the parent container - see comment in StyledPoint
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {pointId && (
          <MainPoint
            pointId={pointId}
            isExpanded={props.isExpanded}
            isSelected={props.selectedPoints.includes(pointId)}
            darkMode={props.darkMode}
          />
        )}
        {!pointId && isExpanded && (
          <SevenShapes
            onShapeClick={createEmptyMain}
            darkMode={props.darkMode}
          />
        )}
      </InnerContainer>
    </StyledRegion>
  );
};

const mapStateToProps = (state: AppState) => {
  const currentMessage = getMessageById(
    state.semanticScreen.currentMessage,
    state
  );

  const isExpanded = state.expandedRegion.region === "center";

  return {
    pointId: currentMessage.main,
    selectedPoints: state.selectedPoints.pointIds,
    isDraft: state.draftMessages.allIds.includes(
      state.semanticScreen.currentMessage
    ),
    isExpanded,
  };
};

const mapDispatchToProps = {
  setMain,
  setExpandedRegion,
  pointCreate,
  togglePoint,
  setSelectedPoints,
  hoverOver,
};

export default connect(mapStateToProps, mapDispatchToProps)(CenterRegion);
