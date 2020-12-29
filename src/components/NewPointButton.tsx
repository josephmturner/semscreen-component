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
import { PointShape } from "../dataModels/dataModels";
import AllShapes from "./AllShapes";
import styled from "styled-components";

interface Props {
  shape: PointShape;
  darkMode?: boolean;
  onClick: () => void;
}

const NewPointButton = (props: Props) => {
  const { shape, onClick } = props;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <StyledSpan onClick={handleClick}>
      <AllShapes shape={shape} darkMode={props.darkMode} />
      <StyledDiv
        darkMode={props.darkMode}
      >{`New ${shape.toLowerCase()} point`}</StyledDiv>
    </StyledSpan>
  );
};

interface StyledProps {
  darkMode?: boolean;
}

const StyledSpan = styled.span`
  display: flex;
  padding-top: 2px;
`;

const StyledDiv = styled.div<StyledProps>`
  opacity: 0.4;
  margin-top: 1px;
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};
`;

export default NewPointButton;
