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
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import {
  getPointById,
  getReferenceData,
  getOriginalMessageId,
  getOriginalAuthorId,
  getOriginalPointId,
} from "../dataModels/pointUtils";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import { StyledImg, StyledSpan, StyledTextArea } from "./StyledPoint";
import Banner from "./Banner";
import PointHoverOptions from "./PointHoverOptions";
import { MainPointShape } from "./MainPointShape";
import { useTextareaIndent } from "../hooks/useTextareaIndent";

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
  pointsMove,
  PointsMoveParams,
  pointUpdate,
  PointUpdateParams,
  pointsDelete,
  PointsDeleteParams,
} from "../actions/pointsActions";
import { setMainPoint, SetMainPointParams } from "../actions/messagesActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";
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
  index: number;
  isExpanded: "expanded" | "minimized" | "balanced";
  isSelected: boolean;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  point: PointI;
  referenceData: PointReferenceI | null;
  isMainPoint: boolean;
  cursorPositionIndex?: number;
  isPersisted: boolean;
  splitIntoTwoPoints: (params: SplitIntoTwoPointsParams) => void;
  combinePoints: (params: CombinePointsParams) => void;
  setCursorPosition: (params: CursorPositionParams) => void;
  clearCursorPosition: () => void;
  pointsMove: (params: PointsMoveParams) => void;
  pointUpdate: (params: PointUpdateParams) => void;
  setMainPoint: (params: SetMainPointParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
  hoverOver: (params: HoverOverParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  togglePoint: (params: TogglePointParams) => void;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
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
    hover: (item: DraggablePointType, monitor: DropTargetMonitor) => {
      if (!spanRef.current) return;

      const hoverIndex = index;
      const dragIndex = item.index;

      const hoverBoundingRect = spanRef.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      let newIndex = hoverIndex;

      if (dragIndex === hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      if (dragIndex === hoverIndex && hoverClientY > hoverMiddleY) newIndex++;

      item.index = newIndex;
      item.region = shape;

      props.hoverOver({
        region: point.shape,
        index: newIndex,
      });
    },
    drop: () => {
      if (!props.isPersisted) {
        props.pointsMove({});
      }
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const { drag, preview } = useDragPoint(pointId, index);

  drop(preview(spanRef));

  useEffect(() => {
    if (typeof cursorPositionIndex === "number" && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
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
    if (arrowPressed === "ArrowUp" && textareaRef.current) {
      (referenceData ||
        (textareaRef.current && textareaRef.current.selectionStart === 0)) &&
        setCursorPosition({ moveTo: "beginningOfPriorPoint", pointId });
    } else if (arrowPressed === "ArrowDown" && textareaRef.current) {
      (referenceData ||
        (textareaRef.current &&
          textareaRef.current.selectionStart === point.content.length)) &&
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

  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.pointUpdate({
      point: { ...point, content: e.target.value },
    });
  };

  const imageUrl = require(`../images/${shape}.svg`);

  //TODO: reuse this function in Point and FocusPoint, it's defined
  //twice
  const handleShapeIconClick = (e: React.MouseEvent) => {
    props.togglePoint({ pointId });
    e.stopPropagation();
  };

  const handlePointSpanClick = (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
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

  const bannerRef = useRef<HTMLDivElement>(null);

  const { textareaIndent, textareaNewline } = useTextareaIndent(
    spanRef,
    bannerRef
  );

  //TODO: Replace StyledImg with Shape svg component, which should
  //also be imported by MainPointShape component.
  return (
    <StyledSpan
      onClick={handlePointSpanClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={spanRef}
      isMainPoint={props.isMainPoint}
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
      {referenceData && (
        <Banner
          authorId={getOriginalAuthorId(referenceData)}
          placement={{ top: "0.1rem", left: "2.2em" }}
          darkMode={props.darkMode}
          ref={bannerRef}
        />
      )}
      <StyledTextArea
        value={point.content}
        onChange={handleChange}
        onBlur={() => {
          if (!point.content) props.pointsDelete({ pointIds: [pointId] });
        }}
        readOnly={!!props.referenceData || props.isPersisted}
        isMainPoint={props.isMainPoint}
        darkMode={props.darkMode}
        ref={textareaRef}
        indent={textareaIndent}
        newLine={textareaNewline}
        autoFocus
        onKeyDown={(e: React.KeyboardEvent) => {
          if (props.isPersisted || !textareaRef.current) {
            return;
          } else {
            if (e.key === "Enter") {
              e.preventDefault();
              textareaRef.current.selectionStart !== 0 &&
                props.splitIntoTwoPoints({
                  pointId,
                  sliceIndex: textareaRef.current.selectionStart,
                });
            } else if (
              e.key === "Backspace" &&
              textareaRef.current.selectionStart === 0 &&
              textareaRef.current.selectionStart ===
                textareaRef.current.selectionEnd
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
              textareaRef.current.selectionStart === point.content.length &&
              textareaRef.current.selectionStart ===
                textareaRef.current.selectionEnd
            ) {
              e.preventDefault();
              combinePoints({
                shape,
                keepIndex: index,
                deleteIndex: index + 1,
              });
            } else if (
              e.key === "ArrowLeft" &&
              textareaRef.current.selectionStart === 0 &&
              textareaRef.current.selectionStart ===
                textareaRef.current.selectionEnd &&
              index !== 0
            ) {
              e.preventDefault();
              setCursorPosition({ moveTo: "endOfPriorPoint", pointId });
            } else if (
              e.key === "ArrowRight" &&
              textareaRef.current.selectionStart === point.content.length &&
              textareaRef.current.selectionStart ===
                textareaRef.current.selectionEnd
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
      {isHovered && !props.isPersisted && (
        <PointHoverOptions pointId={pointId} darkMode={props.darkMode} />
      )}
    </StyledSpan>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const referenceData = getReferenceData(ownProps.pointId, state.points);
  const currentMessage =
    state.messages.byId[state.semanticScreen.currentMessage];
  return {
    point: getPointById(ownProps.pointId, state.points),
    referenceData,
    isMainPoint: ownProps.pointId === currentMessage.main,
    cursorPositionIndex:
      state.cursorPosition.details &&
      state.cursorPosition.details.pointId === ownProps.pointId
        ? state.cursorPosition.details.contentIndex
        : undefined,
    isPersisted: !state.messages.draftIds.includes(
      state.semanticScreen.currentMessage
    ),
  };
};

const mapActionsToProps = {
  splitIntoTwoPoints,
  combinePoints,
  setCursorPosition,
  clearCursorPosition,
  pointsMove,
  pointUpdate,
  setMainPoint,
  pointsDelete,
  hoverOver,
  togglePoint,
  setSelectedPoints,
  setCurrentMessage,
};

export default connect(mapStateToProps, mapActionsToProps)(Point);
