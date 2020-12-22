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
import RegionPoint from "./RegionPoint";
import NewPointButton from "./NewPointButton";
import { StyledRegion, InnerContainer } from "./StyledRegion";
import RegionHeader from "./RegionHeader";
import { PointShape } from "../dataModels/dataModels";
import { getMessageById } from "../dataModels/pointUtils";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  pointCreate,
  PointCreateParams,
  pointsMoveWithinMessage,
  PointsMoveWithinMessageParams,
} from "../actions/draftPointsActions";
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
  shape: PointShape;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  pointIds: string[];
  isDraft: boolean;
  isExpanded: boolean;
  pointCreate: (params: PointCreateParams) => void;
  pointsMoveWithinMessage: (params: PointsMoveWithinMessageParams) => void;
  setExpandedRegion: (params: ExpandedRegionParams) => void;
  selectedPoints: string[];
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  hoverIndex?: number;
  hoverOver: (params: HoverOverParams) => void;
}

const ShapeRegion = (props: AllProps) => {
  const { shape, pointIds } = props;

  //TODO: Reuse logic between regionHeaderRef and expandRef
  //definitions
  const [, regionHeaderRef] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      if (item.region !== shape || item.index !== 0) {
        props.hoverOver({
          region: shape,
          index: 0,
        });
      }

      item.index = 0;
      item.region = shape;
    },
    drop: () => {
      if (props.isDraft) {
        props.pointsMoveWithinMessage({});
      }
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      const newIndex = pointIds.length;

      //Point wasn't already at the bottom of this region
      if (item.region !== shape || item.index !== pointIds.length) {
        props.hoverOver({
          region: shape,
          index: newIndex,
        });

        item.index = newIndex;
        item.region = shape;
      }
    },
    drop: () => {
      if (props.isDraft) {
        props.pointsMoveWithinMessage({});
      }
    },
  });

  const [, expandRef] = useDrop({
    accept: ItemTypes.POINT,
    hover: () => {
      if (!props.isExpanded) {
        props.setExpandedRegion({ region: shape });
      }
    },
  });

  const createEmptyPoint = () => {
    props.pointCreate({
      point: {
        content: "",
        shape,
      },
      index: pointIds.length,
    });
  };

  const onClickRemainingSpace = () => {
    if (!props.isExpanded && props.isDraft) {
      createEmptyPoint();
    }
  };

  const listItems = pointIds.map((id: string, i: number) => (
    <RegionPoint
      key={id}
      pointId={id}
      index={i}
      isExpanded={props.isExpanded}
      isSelected={props.selectedPoints.includes(id)}
      darkMode={props.darkMode}
    />
  ));

  if (props.hoverIndex !== undefined) {
    listItems.splice(
      props.hoverIndex,
      0,
      <HoverLine darkMode={props.darkMode} />
    );
  }

  return (
    <StyledRegion
      onClick={() => props.setExpandedRegion({ region: shape })}
      ref={expandRef}
    >
      <InnerContainer>
        <RegionHeader
          ref={regionHeaderRef}
          shape={shape}
          darkMode={props.darkMode}
        />
        {listItems}
        {props.isExpanded &&
          props.isDraft &&
          props.hoverIndex === undefined && (
            <NewPointButton
              shape={shape}
              onClick={createEmptyPoint}
              darkMode={props.darkMode}
            />
          )}
        <DropTargetDiv
          ref={drop}
          isExpanded={props.isExpanded}
          onClick={onClickRemainingSpace}
        />
      </InnerContainer>
    </StyledRegion>
  );
};

interface DropTargetDivProps {
  isExpanded: boolean;
}

const DropTargetDiv = styled.div<DropTargetDivProps>`
  min-height: ${(props) => (props.isExpanded ? "50px" : 0)};
  height: 100%;
`;

const HoverLine = styled.div<{ darkMode?: boolean }>`
  border-bottom: ${(props) =>
    props.darkMode ? "2px solid white" : "2px solid black"};
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const currentMessageId = state.semanticScreen.currentMessage as string;
  const isDraft = state.draftMessages.allIds.includes(currentMessageId);

  let hoverIndex;
  if (
    state.drag.context &&
    state.drag.context.region === ownProps.shape &&
    // Only set hoverIndex if the message is a draft
    isDraft
  )
    //TODO: add shape matches region above
    hoverIndex = state.drag.context.index;

  const currentMessage = getMessageById(currentMessageId, state);

  const isExpanded = state.expandedRegion.region === ownProps.shape;

  return {
    pointIds: currentMessage.shapes[ownProps.shape],
    selectedPoints: state.selectedPoints.pointIds,
    hoverIndex,
    isDraft,
    isExpanded,
  };
};

const mapDispatchToProps = {
  pointCreate,
  pointsMoveWithinMessage,
  setExpandedRegion,
  togglePoint,
  setSelectedPoints,
  hoverOver,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeRegion);
