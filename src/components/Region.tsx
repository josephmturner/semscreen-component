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
import React, { useRef } from "react";
import styled from "styled-components";
import Point from "./Point";
import { AuthorI } from "../interfaces";

// TODO: correct types below
const Region = (props: {
  region: string;
  isExpanded: boolean;
  author: AuthorI;
  points: any;
  onPointCreate: any;
  onPointUpdate: any;
  onPointDelete: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    points,
    author,
    onPointCreate,
    onPointUpdate,
    onPointDelete,
    onRegionClick,
  } = props;

  //TODO: how to create points in the focus region - it has no shape
 const pointRef = useRef<HTMLTextAreaElement>(null);

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
            isEditing={false}
            pointRef={pointRef}
            onSubmit={onPointUpdate}
            onClick={() => onRegionClick(region, true)}
            onPointDelete={onPointDelete}
          />
        ))}
        {isExpanded && (
          <Point
            point={{
              author: { author },
              content: "",
              shape: region,
            }}
            isEditing={true}
            pointRef={pointRef}
            onSubmit={onPointCreate}
            onClick={() => onRegionClick(region, true)}
            onPointDelete={() => console.log("no point exists with this id")}
            // adding key={points} makes the state of this instance of Point
            // dependent upon the points array so that it re-renders when points
            // changes. This makes it so that new points don't come filled in with
            // content stored in state from the previously submitted point.
            key={points}
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
