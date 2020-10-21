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
import React, { useState } from "react";
import styled from "styled-components";

export interface PanelButtonProps {
  side: "right" | "bottom";
  openClose: "open" | "close";
  onClick: () => void;
  darkMode: boolean;
}

const PanelButton = (props: PanelButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <StyledSvg
      width={props.side === "right" ? "1em" : "2em"}
      height={props.side === "bottom" ? "1em" : "2em"}
      viewBox="0 0 16 16"
      preserveAspectRatio="none"
      opacity={isHovered ? "1" : "0.3"}
      fill={props.darkMode ? "white" : "black"}
      xmlns="http://www.w3.org/2000/svg"
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      side={props.side}
      openClose={props.openClose}
      darkMode={props.darkMode}
    >
      {props.side === "right" && props.openClose === "open" && (
        <path d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z" />
      )}
      {props.side === "right" && props.openClose === "close" && (
        <path d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z" />
      )}
      {props.side === "bottom" && props.openClose === "open" && (
        <path d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z" />
      )}
      {props.side === "bottom" && props.openClose === "close" && (
        <path d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z" />
      )}
    </StyledSvg>
  );
};

interface StyledProps {
  side: "right" | "bottom";
  openClose: "open" | "close";
  darkMode?: boolean;
}
const StyledSvg = styled.svg<StyledProps>`
  position: absolute;
  border: 1px solid ${(props) => (props.darkMode ? "white" : "black")};
  ${(props) =>
    props.side === "right" &&
    props.openClose === "open" &&
    `
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto 0;
    border-right: none;
    border-radius: 10px 0 0 10px;
`}
  ${(props) =>
    props.side === "right" &&
    props.openClose === "close" &&
    `
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
    border-left: none;
    border-radius: 0 10px 10px 0;
`}
  ${(props) =>
    props.side === "bottom" &&
    props.openClose === "open" &&
    `
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
`}
  ${(props) =>
    props.side === "bottom" &&
    props.openClose === "close" &&
    `
  right: 0;
  left: 0;
  top: 0;
  margin: 0 auto;
    border-top: none;
    border-radius: 0 0 10px 10px;
`}
`;

export default PanelButton;
