/*
  Copyright (C) 2021 by USHIN, Inc.

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
import {
  PointShape,
  SemanticScreenRouteParams,
} from "../dataModels/dataModels";
import { getMessageById } from "../dataModels/pointUtils";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers";
import {
  draftPointCreate,
  DraftPointCreateParams,
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
  params: SemanticScreenRouteParams;
  shape: PointShape;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  pointIds: string[];
  isDraft: boolean;
  isExpanded: boolean;
  isMinimized: boolean;
  draftPointCreate: (params: DraftPointCreateParams) => void;
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
  const { messageId } = props.params;

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
        props.pointsMoveWithinMessage({ messageId });
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
        props.pointsMoveWithinMessage({ messageId });
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

  const [, hoverLineRef] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      if (props.isDraft) {
        props.pointsMoveWithinMessage({ messageId });
      }
    },
  });

  const createEmptyPoint = () => {
    props.draftPointCreate({
      point: {
        content: "",
        shape,
      },
      messageId,
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
      params={props.params}
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
      <HoverLineWrapper key="hover-line">
        <HoverLine darkMode={props.darkMode} ref={hoverLineRef} />
      </HoverLineWrapper>
    );
  }

  return (
    <StyledRegion
      onClick={() => props.setExpandedRegion({ region: shape })}
      darkMode={props.darkMode}
      ref={expandRef}
    >
      <InnerContainer>
        {!props.isMinimized && (
          <RegionHeader
            ref={regionHeaderRef}
            isExpanded={props.isExpanded}
            shape={shape}
            darkMode={props.darkMode}
          />
        )}
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

// Wrapping HoverLine in a relaively positioned div allows us to
// add a border which takes up the margin between two points.
// Since HoverLine is a drop target, this ensures that the margin
// between two points always accepts dropped points.
const HoverLineWrapper = styled.div`
  position: relative;
`;

const HoverLine = styled.div<{ darkMode?: boolean }>`
  position: absolute;
  background-color: white;
  width: 100%;
  height: 1.4px;
  top: -2px;
  border: 2px solid black;
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const { messageId } = ownProps.params;
  const isDraft = state.draftMessages.allIds.includes(messageId);

  let hoverIndex;
  if (
    state.drag.context &&
    state.drag.context.region === ownProps.shape &&
    // Only set hoverIndex if the message is a draft
    isDraft
  )
    //TODO: add shape matches region above
    hoverIndex = state.drag.context.index;

  const message = getMessageById(messageId, state);

  const isExpanded = state.expandedRegion.region === ownProps.shape;
  const isMinimized = !!state.expandedRegion.region && !isExpanded;

  return {
    pointIds: message.shapes[ownProps.shape],
    selectedPoints: state.selectedPoints.pointIds,
    hoverIndex,
    isDraft,
    isExpanded,
    isMinimized,
  };
};

const mapDispatchToProps = {
  draftPointCreate,
  pointsMoveWithinMessage,
  setExpandedRegion,
  togglePoint,
  setSelectedPoints,
  hoverOver,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeRegion);
