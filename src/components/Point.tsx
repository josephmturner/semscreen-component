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
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { StyledImg, StyledSpan, StyledTextArea } from "./StyledPoint";
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import { getOriginalAuthorId } from "../dataModels/pointUtils";

import Banner from "./Banner";
import PointHoverOptions from "./PointHoverOptions";
import { MainPointShape } from "./MainPointShape";
import { useTextareaIndent } from "../hooks/useTextareaIndent";

interface Props {
  point: PointI;
  referenceData: PointReferenceI | null;
  isMainPoint: boolean;
  isSelected: boolean;
  readOnlyOverride: boolean;
  darkMode?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown?: (e: React.KeyboardEvent) => void;
  handleBlur?: () => void;
  handlePointSpanClick: (e: React.MouseEvent) => void;
  handleShapeIconClick?: (e: React.MouseEvent) => void;
}

//TODO: fix ref type below
const Point = forwardRef<any, Props>((props, ref) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    get span() {
      return spanRef.current;
    },
    get img() {
      return imgRef.current;
    },
    get banner() {
      return bannerRef.current;
    },
    get textarea() {
      return textareaRef.current;
    },
  }));

  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = require(`../images/${props.point.shape}.svg`);

  const { textareaIndent, textareaNewline } = useTextareaIndent(
    spanRef,
    bannerRef
  );

  return (
    <StyledSpan
      onClick={props.handlePointSpanClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={spanRef}
      //TODO: consider removing isMainPoint from StyledPoint props
      isMainPoint={props.isMainPoint}
      isSelected={props.isSelected}
      darkMode={props.darkMode}
    >
      {props.isMainPoint ? (
        <MainPointShape
          shape={props.point.shape}
          darkMode={props.darkMode}
          onClick={props.handleShapeIconClick}
        />
      ) : (
        <StyledImg
          ref={imgRef}
          src={imageUrl}
          onClick={props.handleShapeIconClick}
          isMainPoint={props.isMainPoint}
          darkMode={props.darkMode}
          alt={props.point.shape}
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
        value={props.point.content}
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        readOnly={!!props.referenceData || props.readOnlyOverride}
        isMainPoint={props.isMainPoint}
        darkMode={props.darkMode}
        ref={textareaRef}
        indent={textareaIndent}
        newLine={textareaNewline}
        autoFocus
        onKeyDown={props.handleKeyDown}
      />
      {isHovered && !props.readOnlyOverride && (
        <PointHoverOptions
          pointId={props.point._id}
          darkMode={props.darkMode}
        />
      )}
    </StyledSpan>
  );
});

export default Point;
