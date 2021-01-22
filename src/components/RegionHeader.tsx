/*
  Copyright (C) 2021 by USHIN, Inc.

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
import { PointShape } from "../dataModels/dataModels";
import AllShapes from "./AllShapes";

//TODO: Properly type ref
const RegionHeader = React.forwardRef(
  (props: { shape: PointShape; darkMode?: boolean }, ref: any) => {
    return (
      <StyledSpan ref={ref}>
        <AllShapes shape={props.shape} darkMode={props.darkMode} />
        {props.shape.slice(0, 1).toUpperCase() + props.shape.slice(1)}
      </StyledSpan>
    );
  }
);

const StyledSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default RegionHeader;
