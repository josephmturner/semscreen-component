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
import styled from "styled-components";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

import { SemanticScreenRouteParams } from "../dataModels/dataModels";

interface Props {
  params: SemanticScreenRouteParams;
  side: "right" | "bottom";
  color: string;
  onClick: () => void;
  darkMode: boolean;
  onDragOver?: () => void;
}

const PanelButton = (props: Props) => {
  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: props.onDragOver,
  });

  return (
    <StyledSvg
      ref={drop}
      width={props.side === "right" ? "1em" : "2em"}
      height={props.side === "bottom" ? "1em" : "2em"}
      viewBox="0 0 16 16"
      preserveAspectRatio="none"
      onClick={props.onClick}
      side={props.side}
      darkMode={props.darkMode}
      color={props.color}
    >
      {props.side === "right" && (
        <path d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z" />
      )}
      {props.side === "bottom" && (
        <path d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z" />
      )}
    </StyledSvg>
  );
};

interface StyledProps {
  side: "right" | "bottom";
  darkMode?: boolean;
  color: string;
}

const StyledSvg = styled.svg<StyledProps>`
  position: absolute;
  background-color: ${(props) => props.color};
  opacity: 1;
  fill: ${(props) => (props.darkMode ? "black" : "white")};
  z-index: 9999;
  :hover {
    fill: ${(props) => (props.darkMode ? "white" : "black")};
  }
  ${(props) =>
    props.side === "right" &&
    `
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto 0;
    border-right: none;
    border-radius: 3px 0 0 3px;
`}
  ${(props) =>
    props.side === "bottom" &&
    `
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    border-bottom: none;
    border-radius: 3px 3px 0 0;
`};
`;

export default PanelButton;
