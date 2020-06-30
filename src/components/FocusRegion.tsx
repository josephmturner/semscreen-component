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
const FocusRegion = (props: {
  region: string;
  isExpanded: string;
  author: AuthorI;
  points: PointI[];
  messageDispatch: any;
  editingPoint: PointI["pointId"];
  setEditingPoint: any;
  createEmptyFocus: any;
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
    createEmptyFocus,
    onRegionClick,
  } = props;

  const [chooseShapes, setChooseShapes] = useState(false);

  // replace imageUrl with 7-icon, "U-shaped" svg, which
  // expands to fill the middle of the expanded focus region.
  // When expanded, each of the 7 shapes calls setMakingNewFocus
  const placeholderText = `New focus point`;
  const placeholderImg = require(`../images/Merits.svg`);
  const placeholderImgAlt = "Choose a new focus shape.";

  const handlePlaceholderClick = () => {
    onRegionClick(region, true);
    setChooseShapes(true);
  };

  const handleClick = (shape: string, e: any) => {
    e.stopPropagation();
    onRegionClick(region, true);
    createEmptyFocus(shape);
    setChooseShapes(false);
  };

  useEffect(() => {
    !(isExpanded === "expanded") && setChooseShapes(false);
  }, [isExpanded]);

  return (
    <StyledRegion
      isExpanded={isExpanded}
      backgroundColor={author.styles.backgroundColor}
      onClick={() => onRegionClick(region, false)}
    >
      {points.map((p: any) => (
        <Point
          key={p.pointId}
          point={p}
          messageDispatch={messageDispatch}
          isEditing={editingPoint === p.pointId ? true : false}
          setEditingPoint={setEditingPoint}
          onClick={() => onRegionClick(region, true)}
        />
      ))}
      {!chooseShapes && isExpanded && (
        <Placeholder
          text={placeholderText}
          img={placeholderImg}
          imgAlt={placeholderImgAlt}
          onClick={handlePlaceholderClick}
        />
      )}
      {chooseShapes && isExpanded && (
        <ul>
          {[
            "Facts",
            "People",
            "Thoughts",
            "Actions",
            "Feelings",
            "Needs",
            "Topics",
          ].map((shape) => (
            <li key={shape}>
              <button
                onClick={(e) => handleClick(shape, e)}
              >{`new ${shape} focus point`}</button>
            </li>
          ))}
        </ul>
      )}
    </StyledRegion>
  );
};

export default FocusRegion;
