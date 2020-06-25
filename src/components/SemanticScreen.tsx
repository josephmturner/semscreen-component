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

import { v4 as uuidv4 } from "uuid";

import Region from "./Region";
import FocusRegion from "./FocusRegion";
import Banner from "./Banner";
import ShapesRim from "./ShapesRim";
import StyledSemanticScreen from "./StyledSemanticScreen";

import { MessageI } from "../interfaces";

// import and use onSetFocus
const SemanticScreen = (props: {
  message: MessageI;
  showShapes: boolean;
  onAuthorUpdate: (e: any) => void;
  onPointCreate: (e: any) => void;
  onPointUpdate: (e: any) => void;
  onPointsDelete: (e: any) => void;
  onSetFocus: (e: any) => void;
}) => {
  const {
    showShapes,
    message,
    onAuthorUpdate,
    onPointCreate,
    onPointUpdate,
    onPointsDelete,
    onSetFocus,
  } = props;

  const author = message.author || {
    name: "anonymous",
    styles: {
      textColor: "#000",
      backgroundColor: "#fff",
    },
    authorId: uuidv4(),
    authorDate: new Date(),
  };

  const points = message.points || [];

  const [expandedRegion, setExpandedRegion] = useState("");

  const [makingNewFocus, setMakingNewFocus] = useState("");

  const createEmptyFocus = (shape: string) => {
    deleteEmptyPoints();
    onPointCreate({
      author: author,
      content: "",
      shape: shape,
    });
    setMakingNewFocus(shape);
  };

  useEffect(() => {
    if (makingNewFocus) {
      const point = points.find(
        (p) => !p.content && p.shape === makingNewFocus
      );
      point && onSetFocus(point.pointId);
      setMakingNewFocus("");
    }
  }, [makingNewFocus, onSetFocus, points]);

  const deleteEmptyPoints = () => {
    console.log("deleteempty called");
    onPointsDelete(points.filter((p) => !p.content).map((p) => p.pointId));
  };

  const handleRegionClick = (region: string, childClicked: boolean): void => {
    if (region !== expandedRegion) {
      setExpandedRegion(region);
      deleteEmptyPoints();
    } else if (region === expandedRegion && !childClicked) {
      setExpandedRegion("");
      deleteEmptyPoints();
    }
  };

  return (
    <StyledSemanticScreen
      color={author.styles.textColor}
      expandedRegion={expandedRegion}
      showShapes={showShapes}
    >
      <Banner
        author={author}
        showShapes={showShapes}
        onAuthorUpdate={onAuthorUpdate}
      />
      {[
        "Facts",
        "Merits",
        "People",
        "Thoughts",
        "Focus",
        "Actions",
        "Feelings",
        "Needs",
        "Topics",
      ].map((region) => {
        if (region !== "Focus")
          return (
            <Region
              region={region}
              isExpanded={region === expandedRegion}
              author={author}
              points={points
                .filter((p) => p.shape === region)
                .filter((p) => p.pointId !== message.focus)}
              onPointCreate={onPointCreate}
              onPointUpdate={onPointUpdate}
              onPointsDelete={onPointsDelete}
              onRegionClick={handleRegionClick}
              key={region}
            />
          );
        return (
          <FocusRegion
            region={region}
            isExpanded={region === expandedRegion}
            author={author}
            points={points.filter((p) => p.pointId === message.focus)}
            onPointUpdate={onPointUpdate}
            onPointsDelete={onPointsDelete}
            createEmptyFocus={createEmptyFocus}
            onRegionClick={handleRegionClick}
            key={region}
          />
        );
      })}
      <ShapesRim showShapes={showShapes} />
    </StyledSemanticScreen>
  );
};

export default SemanticScreen;
