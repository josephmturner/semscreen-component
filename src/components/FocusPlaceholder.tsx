/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React from "react";
import styled from "styled-components";

//TODO: would it be better to not split out FocusPlaceholder from
//Placeholder, and instead store the styles which differ between the
//two in their respective parent components?
const FocusPlaceholder = (props: {
  text: string;
  img: string;
  imgAlt: string;
  onClick: any;
  opacity: number;
}) => {
  const { text, img, imgAlt, onClick, opacity } = props;

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <StyledSpan onClick={handleClick} opacity={opacity}>
      <StyledImg src={img} alt={imgAlt} />
      <StyledDiv>{text}</StyledDiv>
    </StyledSpan>
  );
};

interface StyledProps {
  opacity: number;
}

const StyledSpan = styled.span<StyledProps>`
  display: flex;
  margin: auto;
  opacity: ${(props) => props.opacity};
`;

const StyledImg = styled.img`
  height: 20px;
  margin: 0px 4px 0 3px;
`;

const StyledDiv = styled.div`
  margin-top: 1px;
  font-size: small;
`;

export default FocusPlaceholder;
