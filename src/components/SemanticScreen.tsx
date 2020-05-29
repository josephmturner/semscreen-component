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
import Banner from "./Banner";
import StyledSemanticScreen from "./StyledSemanticScreen";
import ShapesRim from "./ShapesRim";
import { MessageI, PointI } from "../interfaces";

const SemanticScreen = (props: {
  messageInitialState: MessageI;
  showShapes: boolean;
  onPointChange: (e: any) => void;
}) => {
  const messageInitialState = props.messageInitialState;
  const showShapes = props.showShapes;

  const propagatePointChange = props.onPointChange;

  const regionNames = [
    "Facts",
    "Merits",
    "People",
    "Thoughts",
    "Focus",
    "Actions",
    "Feelings",
    "Needs",
    "Topics",
  ];

  const author = messageInitialState.author || {
    name: "anonymous",
    styles: {
      textColor: "#000",
      backgroundColor: "#fff",
    },
    authorId: uuidv4(),
    authorDate: new Date(),
  };

  const [points, setPoints] = useState(messageInitialState.points || []);

  const [expandedRegion, setExpandedRegion] = useState("");

  const handleRegionClick = (region: string, pointClicked: boolean): void => {
    if (region !== expandedRegion) {
      setExpandedRegion(region);
    } else if (region === expandedRegion && !pointClicked) {
      setExpandedRegion("");
    }
  };

  const handlePointAdd = (p: PointI) => {
    setPoints((points) => [...points, p]);
  };
  const handlePointChange = (p: PointI) => {
    const matchedIndex = points.findIndex((pt) => pt.pointId === p.pointId);
    points[matchedIndex] = p;
    setPoints(points);
    propagatePointChange(p);
  };

  return (
    <StyledSemanticScreen
      color={author.styles.textColor}
      expandedRegion={expandedRegion}
      showShapes={showShapes}
    >
      <Banner author={author} showShapes={showShapes} />

      {regionNames.map((region) => (
        <Region
          region={region}
          isExpanded={region === expandedRegion}
          author={author}
          points={points.filter((p) => p.shape === region)}
          onPointAdd={handlePointAdd}
          onPointChange={handlePointChange}
          onRegionClick={handleRegionClick}
          key={region}
        />
      ))}

      <ShapesRim showShapes={showShapes} />
    </StyledSemanticScreen>
  );
};

export default SemanticScreen;
