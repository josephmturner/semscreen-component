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
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import Point from "./Point";
import { AuthorI } from "../interfaces";

// TODO: correct types below
const Region = (props: {
  region: string;
  isExpanded: boolean;
  author: AuthorI;
  points: any;
  onPointAdd: any;
  onPointChange: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    points,
    author,
    onPointAdd,
    onPointChange,
    onRegionClick,
  } = props;

 //TODO: add author to initialstate, interfaces, and below
 //TODO: how to create points in the focus region - it has no shape
  return (
    <StyledRegion
      backgroundColor={author.styles.backgroundColor}
      onClick={() => onRegionClick(region, false)}
    >
      <ul className="list-unstyled">
        {points.map((p: any) => (
          <Point
            key={p.pointId}
            point={p}
            onSubmit={onPointChange}
            onPointClick={() => onRegionClick(region, true)}
          />
        ))}
        {isExpanded && (
          <Point
            point={{
              author: { author },
              content: "turn me into a placeholder with this css: https://github.com/lovasoa/react-contenteditable/pull/64#issuecomment-373906517",
              shape: region,
              pointId: uuidv4(),
              pointDate: new Date(),
            }}
            onSubmit={onPointAdd}
            onPointClick={() => onRegionClick(region, true)}
          />
        )}
      </ul>
    </StyledRegion>
  );
};

interface StyledRegionProps {
  backgroundColor: string;
}

const StyledRegion = styled.div<StyledRegionProps>`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.backgroundColor};
  overflow: auto;
`;
export default Region;
