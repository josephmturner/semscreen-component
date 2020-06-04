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
import ShapesRim from "./ShapesRim";
import StyledSemanticScreen from "./StyledSemanticScreen";

import { PointI, AuthorI } from "../interfaces";

const SemanticScreen = (props: {
  author: AuthorI;
  points: PointI[];
  showShapes: boolean;
  onAuthorUpdate: (e: any) => void;
  onPointCreate: (e: any) => void;
  onPointUpdate: (e: any) => void;
  onPointDelete: (e: any) => void;
}) => {
  const showShapes = props.showShapes;
  const onAuthorUpdate = props.onAuthorUpdate;
  const onPointCreate = props.onPointCreate;
  const onPointUpdate = props.onPointUpdate;
  const onPointDelete = props.onPointDelete;

  const author = props.author || {
    name: "anonymous",
    styles: {
      textColor: "#000",
      backgroundColor: "#fff",
    },
    authorId: uuidv4(),
    authorDate: new Date(),
  };

  const points = props.points || [];

  const [expandedRegion, setExpandedRegion] = useState("");

  const handleRegionClick = (region: string, pointClicked: boolean): void => {
    if (region !== expandedRegion) {
      setExpandedRegion(region);
    } else if (region === expandedRegion && !pointClicked) {
      setExpandedRegion("");
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
      ].map((region) => (
        <Region
          region={region}
          isExpanded={region === expandedRegion}
          author={author}
          points={points.filter((p) => p.shape === region)}
          onPointCreate={onPointCreate}
          onPointUpdate={onPointUpdate}
          onPointDelete={onPointDelete}
          onRegionClick={handleRegionClick}
          key={region}
        />
      ))}
      <ShapesRim showShapes={showShapes} />
    </StyledSemanticScreen>
  );
};

export default SemanticScreen;
