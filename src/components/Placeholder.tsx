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
import Media from "react-bootstrap/Media";
import styled from "styled-components";

const Placeholder = (props: { shape: string; onClick: any }) => {
  const { shape, onClick } = props;

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  const imageUrl = require(`../images/${shape}.svg`);

  return (
    <Media as="li" onClick={handleClick}>
      <img width={20} height={20} className="mr-3" src={imageUrl} alt="shape" />
      <Media.Body>
        <StyledDiv>new point</StyledDiv>
      </Media.Body>
    </Media>
  );
};

const StyledDiv = styled.div`
  opacity: 0.5;
`;
export default Placeholder;
