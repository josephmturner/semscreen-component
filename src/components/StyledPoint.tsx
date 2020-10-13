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
import { AuthorI } from "../dataModels/dataModels";

interface StyledPointProps {
  isMainPoint?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  referenceAuthor?: AuthorI;
  darkMode?: boolean;
}

export const StyledSpan = styled.span<StyledPointProps>`
  position: relative;
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  ${(props) =>
    props.referenceAuthor &&
    `padding: 0.3rem 0.8rem 0.2rem 0.2rem;
   `}
  ${(props) =>
    props.isSelected &&
    `
  background-color: #777;
  border-radius: 5px;
`}
`;

export const StyledImg = styled.img<StyledPointProps>`
  position: absolute;
  height: ${(props) => (props.isMainPoint ? "23px" : "17px")};
  top: ${(props) => (props.isMainPoint ? 0 : "2px")};
  margin-top: ${(props) => (props.referenceAuthor ? "0.8rem" : 0)};
  left: ${(props) => (props.referenceAuthor ? "7px" : 0)};
  opacity: 0.7;
`;

export const StyledTextArea = styled(TextareaAutosize)<StyledPointProps>`
  width: 100%;
  border: 0;
  color: ${(props) => (props.darkMode ? "white" : "black")};
  background-color: transparent;
  font-family: Arial;
  font-size: ${(props) => (props.isMainPoint ? "medium" : "small")};
  font-weight: ${(props) => (props.isMainPoint ? "bold" : "normal")};
  resize: none;
  text-indent: ${(props) => (props.isMainPoint ? "2em" : "1.8em")};
  ${(props) =>
    props.referenceAuthor &&
    ` border: 1.5px solid ${props.referenceAuthor.color}; border-top: 0.5rem solid ${props.referenceAuthor.color}; border-radius: 3px; padding: 3px 0 3px 3px;`}
`;
