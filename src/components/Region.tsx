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
import React, { useEffect, useState } from "react";
import Point from "./Point";
import Placeholder from "./Placeholder";
import StyledRegion from "./StyledRegion";
import { AuthorI, PointI } from "../interfaces";

// TODO: correct types below
const Region = (props: {
  region: string;
  isExpanded: string;
  author: AuthorI;
  points: PointI[];
  messageDispatch: any;
  editingPoint: PointI["pointId"];
  setEditingPoint: any;
  createEmptyPoint: any;
  onRegionClick: any;
}) => {
  const {
    region,
    isExpanded,
    points,
    author,
    messageDispatch,
    editingPoint,
    setEditingPoint,
    createEmptyPoint,
    onRegionClick,
  } = props;

  const renderPoints =
    isExpanded === "expanded" ? points : points.filter((p) => p.content);

  const [changingPointFocus, setChangingPointFocus] = useState(false);

 //TODO: call setEditingPoint with the pointId of the point whose
 //index is 1 greater than editingPoint (if called by pressing enter).
 //see comment in SemanticScreen
 useEffect(() => {
    if (changingPointFocus) {
      setEditingPoint(points[points.length - 1].pointId);
      setChangingPointFocus(false);
    }
  }, [changingPointFocus]);

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
          messageDispatch={messageDispatch}
          isEditing={editingPoint === p.pointId ? true : false}
          setEditingPoint={setEditingPoint}
          createEmptyPoint={() => {
            createEmptyPoint(region);
            setChangingPointFocus(true);
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
            setChangingPointFocus(true);
            createEmptyPoint(region);
          }}
        />
      )}
    </StyledRegion>
  );
};

export default Region;
