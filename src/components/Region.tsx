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
import Point from "./Point";
import Placeholder from "./Placeholder";
import StyledRegion from "./StyledRegion";
import { AuthorI, PointI, RegionI } from "../constants/AppState";

const Region = (props: {
  region: RegionI;
  isExpanded: string;
  author: AuthorI;
  points: PointI[];
  appDispatch: any;
  editingPoint: PointI["pointId"];
  createEmptyPoint: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    points,
    author,
    appDispatch,
    editingPoint,
    createEmptyPoint,
    onRegionClick,
  } = props;

  const renderPoints =
    isExpanded === "expanded" ? points : points.filter((p) => p.content);

  const placeholderText = `New ${region.toLowerCase()} point`;
  const placeholderImg = require(`../images/${region}.svg`);
  const placeholderImgAlt = region;

  return (
    <StyledRegion
      isExpanded={isExpanded}
      backgroundColor={author.styles.backgroundColor}
      onClick={() => onRegionClick(region, false)}
    >
      {renderPoints.map((p: any) => (
        <Point
          key={p.pointId}
          point={p}
          appDispatch={appDispatch}
          isEditing={editingPoint === p.pointId}
          onEnterPress={() => {
            createEmptyPoint(
              region,
              points.findIndex((p) => p.pointId === editingPoint) + 1
            );
          }}
          onClick={() => onRegionClick(region, true)}
        />
      ))}
      {isExpanded === "expanded" && (
        <Placeholder
          text={placeholderText}
          img={placeholderImg}
          imgAlt={placeholderImgAlt}
          onClick={() => {
            createEmptyPoint(region, points.length);
          }}
        />
      )}
    </StyledRegion>
  );
};

export default Region;
