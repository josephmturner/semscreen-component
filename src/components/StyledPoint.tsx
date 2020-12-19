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
import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";

import { blackOrWhite } from "../dataModels/pointUtils";

interface StyledPointProps {
  isMainPoint?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  darkMode?: boolean;
  indent?: string;
  newLine?: boolean;
  suppressBorder?: boolean;
}

export const StyledDiv = styled.div<StyledPointProps>`
  position: relative;
  //TODO: perhaps this width: 100% should be replaced with textarea
  //styles which allow it to grow along with its content?
  //The issue is that if we omit width: 100%, banner names can get cut
  //off without expanding when the center region expands
  //width: 100%;
  margin: 1px 0;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  background-color: var(--colorBG);
  border-radius: 3px;

  ${(props) =>
    props.isHovered &&
    !props.suppressBorder &&
    `
    //TODO: add style so that the whole point doesn't move when hovered
    //border-box: something?
    border: 1px solid var(--colorFG);
  `}
`;

export const StyledImg = styled.img<StyledPointProps>`
  position: absolute;
  height: ${(props) => (props.isMainPoint ? "23px" : "17px")};
  top: ${(props) => (props.isMainPoint ? 0 : "0.1rem")};
  left: 0.2rem;
  z-index: 4;
`;

export const TextareaWrapper = styled.div<StyledPointProps>`
  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  & > textarea {
    color: var(--colorFG);

    font-size: ${(props) => (props.isMainPoint ? "medium" : "small")};
    font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
    text-indent: ${(props) => (props.indent ? props.indent : "1.8em")};

    ${(props) =>
      props.newLine &&
      ` top: 1rem;
      margin-bottom: 1rem;
    `};
  }
`;

export const StyledTextArea = styled(TextareaAutosize)`
  position: relative;
  width: 100%;
  border: 0;
  outline: none;
  overflow: hidden;
  resize: none;
  background-color: transparent;
  font-family: Arial;
`;
