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
import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import Region from "./Region";
import FocusRegion from "./FocusRegion";
import Banner from "./Banner";
import ShapesRim from "./ShapesRim";
import StyledSemanticScreen from "./StyledSemanticScreen";

import { MessageI, PointShape, RegionI } from "../constants/AppState";

const SemanticScreen = (props: {
  message: MessageI;
  editingPoint: string;
  showShapes: boolean;
  onAuthorUpdate: (e: any) => void;
  appDispatch: any;
}) => {
  const {
    showShapes,
    editingPoint,
    message,
    onAuthorUpdate,
    appDispatch,
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
  //TODO: what if App doesn't pass any points to SemanticScreen?

  const [expandedRegion, setExpandedRegion] = useState("");

  const createEmptyPoint = (shape: PointShape, index: number) => {
    appDispatch({
      type: "pointCreate",
      point: {
        author: author,
        content: "",
        shape: shape,
      },
      shape: shape,
      index: index,
    });
  };

  const deleteEmptyPoints = () => {
    appDispatch({
      type: "pointsDelete",
      pointIds: Object.values(message.points)
        .flat()
        .filter((p) => !p.content)
        .map((p) => p.pointId),
    });
  };

  //TODO: consider merging createEmptyFocus and createEmptyPoint
  const createEmptyFocus = (shape: PointShape) => {
    deleteEmptyPoints();
    appDispatch({
      type: "pointCreate",
      point: {
        author: author,
        content: "",
        shape: shape,
      },
      shape: shape,
      index: message.points[shape].length,
      focus: true,
    });
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

  const regions: Array<RegionI> = [
    "facts",
    "merits",
    "people",
    "thoughts",
    "focus",
    "actions",
    "feelings",
    "needs",
    "topics",
  ];

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
      {regions.map((region: RegionI) => {
        if (region === "focus") {
          return (
            <FocusRegion
              region={region}
              isExpanded={
                region === expandedRegion
                  ? "expanded"
                  : expandedRegion === ""
                  ? "balanced"
                  : "minimized"
              }
              author={author}
              points={Object.values(message.points)
                .flat()
                .filter((p) => p.pointId === message.focus)}
              appDispatch={appDispatch}
              editingPoint={editingPoint}
              createEmptyFocus={createEmptyFocus}
              onRegionClick={handleRegionClick}
              key={region}
            />
          );
        } else if (region === "merits") {
          return <div></div>;
        } else {
          return (
            <Region
              region={region}
              isExpanded={
                region === expandedRegion
                  ? "expanded"
                  : expandedRegion === ""
                  ? "balanced"
                  : "minimized"
              }
              author={author}
              points={message.points[region as PointShape].filter(
                (p) => p.pointId !== message.focus
              )}
              appDispatch={appDispatch}
              editingPoint={editingPoint}
              createEmptyPoint={createEmptyPoint}
              onRegionClick={handleRegionClick}
              key={region}
            />
          );
        }
      })}
      <ShapesRim showShapes={showShapes} />
    </StyledSemanticScreen>
  );
};

export default SemanticScreen;
