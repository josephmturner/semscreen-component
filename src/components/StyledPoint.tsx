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

interface StyledPointProps {
  isMainPoint?: boolean;
  isSelected?: boolean;
  darkMode?: boolean;
  indent?: string;
  newLine?: boolean;
}

export const StyledSpan = styled.span<StyledPointProps>`
  position: relative;
  //TODO: perhaps this width: 100% should be replaced with textarea
  //styles which allow it to grow along with its content?
  width: 100%;
  margin: 1px 0;
  ${(props) =>
    props.isSelected &&
    `
  background-color: #777;
  border-radius: 3px;
`}

  :hover {
    border: 1px solid ${(props) => (props.darkMode ? "white" : "black")};
    border-radius: 3px;
  }
`;

export const StyledImg = styled.img<StyledPointProps>`
  position: absolute;
  height: ${(props) => (props.isMainPoint ? "23px" : "17px")};
  top: ${(props) => (props.isMainPoint ? 0 : "2px")};
  left: 0.2rem;
  z-index: 4;
`;

export const StyledTextArea = styled(TextareaAutosize)<StyledPointProps>`
  position: relative;
  width: 100%;
  border: 0;
  overflow: hidden;
  color: ${(props) => (props.darkMode ? "white" : "black")};
  background-color: transparent;
  font-family: Arial;
  font-size: ${(props) => (props.isMainPoint ? "medium" : "small")};
  font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
  resize: none;
  text-indent: ${(props) => (props.indent ? props.indent : "1.8em")};
  ${(props) =>
    props.newLine &&
    ` top: 1rem;
      margin-bottom: 1rem;
    `};
`;
