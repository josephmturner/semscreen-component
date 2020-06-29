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

const Placeholder = (props: {
  text: string;
  img: string;
  imgAlt: string;
  onClick: any;
}) => {
  const { text, img, imgAlt, onClick } = props;

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div onClick={handleClick}>
      <img width={20} height={20} className="mr-3" src={img} alt={imgAlt} />
      <StyledSpan>{text}</StyledSpan>
    </div>
  );
};

const StyledSpan = styled.span`
  opacity: 0.5;
  padding-bottom: 100px;
`;
export default Placeholder;
