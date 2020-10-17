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
import React, { useEffect, useRef, useState } from "react";
import { AuthorI, PointI, PointReferenceI } from "../dataModels/dataModels";
import { getPointById, getReferenceData } from "../dataModels/getters";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import { StyledImg, StyledSpan, StyledTextArea } from "./StyledPoint";
import Banner from "./Banner";

import { useDrop, DropTargetMonitor } from "react-dnd";
import { useDragPoint } from "../hooks/useDragPoint";
import { XYCoord } from "dnd-core";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  setCursorPosition,
  clearCursorPosition,
  CursorPositionParams,
} from "../actions/cursorPositionActions";
import {
  splitIntoTwoPoints,
  SplitIntoTwoPointsParams,
  combinePoints,
  CombinePointsParams,
  pointMove,
  PointMoveParams,
  pointUpdate,
  PointUpdateParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/pointsActions";
import { setMainPoint, SetMainPointParams } from "../actions/messageActions";

interface OwnProps {
  pointId: string;
  index: number;
  onClick: (e: React.MouseEvent) => void;
  readOnlyOverride?: boolean;
  isSelected: boolean;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  referenceData: PointReferenceI | null;
  referenceAuthor?: AuthorI;
  isMainPoint: boolean;
  cursorPositionIndex?: number;
  splitIntoTwoPoints: (params: SplitIntoTwoPointsParams) => void;
  combinePoints: (params: CombinePointsParams) => void;
  setCursorPosition: (params: CursorPositionParams) => void;
  clearCursorPosition: () => void;
  pointMove: (params: PointMoveParams) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
}

const Point = (props: AllProps) => {
  const {
    point,
    referenceData,
    pointId,
    index,
    combinePoints,
    cursorPositionIndex,
    clearCursorPosition,
    setCursorPosition,
  } = props;
  const shape = point.shape;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover(item: DraggablePointType, monitor: DropTargetMonitor) {
      if (!ref.current || (item.isReferencedPoint && item.shape !== shape)) {
        return;
      }

      const hoverIndex = index;

      //Point was the focus (lacks index)
      if (typeof item.index !== "number") {
        props.pointMove({
          pointId: item.pointId,
          newShape: shape,
          newIndex: hoverIndex,
        });
        item.index = hoverIndex;
        item.shape = shape;
      } else {
        const dragIndex = item.index as number;
        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const clientOffset = monitor.getClientOffset();

        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        props.pointMove({
          pointId: item.pointId,
          oldIndex: item.index,
          newShape: shape,
          newIndex: hoverIndex,
        });

        item.index = hoverIndex;
        item.shape = shape;
      }
    },
  });

  const ref = useRef<HTMLTextAreaElement>(null);

  const pointRef = useRef<HTMLSpanElement>(null);

  const { isDragging, drag, preview } = useDragPoint(pointId, index);

  drop(preview(pointRef));

  useEffect(() => {
    if (typeof cursorPositionIndex === "number" && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(
        cursorPositionIndex as number,
        cursorPositionIndex as number
      );
      clearCursorPosition();
    }
  }, [cursorPositionIndex, clearCursorPosition]);

  const [arrowPressed, setArrowPressed] = useState<
    "ArrowUp" | "ArrowDown" | undefined
  >(undefined);
  useEffect(() => {
    if (arrowPressed === "ArrowUp" && ref.current) {
      (referenceData || (ref.current && ref.current.selectionStart === 0)) &&
        setCursorPosition({ moveTo: "beginningOfPriorPoint", pointId });
    } else if (arrowPressed === "ArrowDown" && ref.current) {
      (referenceData ||
        (ref.current && ref.current.selectionStart === point.content.length)) &&
        setCursorPosition({ moveTo: "beginningOfNextPoint", pointId });
    }
    setArrowPressed(undefined);
  }, [
    arrowPressed,
    point.content.length,
    referenceData,
    setCursorPosition,
    pointId,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
    });
  };

  const imageUrl = require(`../images/${shape}.svg`);

  const onClickShapeIcon = () => {
    if (!props.readOnlyOverride) {
      props.setMainPoint({ pointId });
    }
  };

  return (
    <StyledSpan
      onClick={props.onClick}
      ref={pointRef}
      isMainPoint={props.isMainPoint}
      isDragging={isDragging}
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
          if (!point.content) props.pointsDelete({ pointIds: [pointId] });
        }}
        readOnly={!!props.referenceData || props.readOnlyOverride}
        isMainPoint={props.isMainPoint}
        referenceAuthor={props.referenceAuthor}
        darkMode={props.darkMode}
        ref={ref}
        autoFocus
        onKeyDown={(e: React.KeyboardEvent) => {
          if (props.readOnlyOverride) {
            return;
          } else {
            if (e.key === "Enter") {
              e.preventDefault();
              ref.current &&
                !!point.content &&
                props.splitIntoTwoPoints({
                  pointId,
                  sliceIndex: ref.current.selectionStart,
                });
            } else if (
              e.key === "Backspace" &&
              ref.current &&
              ref.current.selectionStart === 0 &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              if (index !== 0) {
                e.preventDefault();
                combinePoints({
                  shape,
                  keepIndex: index - 1,
                  deleteIndex: index,
                });
              } else if (index === 0 && !point.content) {
                e.preventDefault();
                combinePoints({
                  shape,
                  keepIndex: index,
                  deleteIndex: index + 1,
                });
              }
            } else if (
              e.key === "Delete" &&
              ref.current &&
              ref.current.selectionStart === point.content.length &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              e.preventDefault();
              combinePoints({
                shape,
                keepIndex: index,
                deleteIndex: index + 1,
              });
            } else if (
              e.key === "ArrowLeft" &&
              ref.current &&
              ref.current.selectionStart === 0 &&
              ref.current.selectionStart === ref.current.selectionEnd &&
              index !== 0
            ) {
              e.preventDefault();
              setCursorPosition({ moveTo: "endOfPriorPoint", pointId });
            } else if (
              e.key === "ArrowRight" &&
              ref.current &&
              ref.current.selectionStart === point.content.length &&
              ref.current.selectionStart === ref.current.selectionEnd
            ) {
              e.preventDefault();
              setCursorPosition({
                moveTo: "beginningOfNextPoint",
                pointId,
              });
            } else if (e.key === "ArrowUp" && index !== 0) {
              setArrowPressed("ArrowUp");
            } else if (e.key === "ArrowDown") {
              setArrowPressed("ArrowDown");
            }
          }
        }}
      />
      {referenceData && (
        <Banner
          authorId={referenceData.referenceAuthorId}
          placement={{ top: "-0.15rem", right: "0.8rem" }}
          darkMode={props.darkMode}
        />
      )}
    </StyledSpan>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const referenceData = getReferenceData(ownProps.pointId, state.points);
  //TODO: Would it be cleaner not to access referenceAuthor in Point,
  //but instead pass referenceAuthorId to the StyledPoint components?
  //(we would then have to connect those components to redux)
  let referenceAuthor;
  if (referenceData) {
    referenceAuthor = state.authors.byId[referenceData.referenceAuthorId];
  }
  return {
    point: getPointById(ownProps.pointId, state.points),
    referenceData: getReferenceData(ownProps.pointId, state.points),
    referenceAuthor,
    isMainPoint: ownProps.pointId === state.message.main,
    cursorPositionIndex:
      state.cursorPosition.details &&
      state.cursorPosition.details.pointId === ownProps.pointId
        ? state.cursorPosition.details.contentIndex
        : undefined,
  };
};

const mapActionsToProps = {
  splitIntoTwoPoints,
  combinePoints,
  setCursorPosition,
  clearCursorPosition,
  pointMove,
  pointUpdate,
  setMainPoint,
  pointsDelete,
};

export default connect(mapStateToProps, mapActionsToProps)(Point);
