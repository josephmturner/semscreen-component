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
import React, { useEffect, useRef } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { wrapGrid } from "animate-css-grid";
import { v4 as uuidv4 } from "uuid";
import randomColor from "randomcolor";

import Region from "./Region";
import MeritsRegion from "./MeritsRegion";
import FocusRegion from "./FocusRegion";
import Banner from "./Banner";
import StyledSemanticScreen from "./StyledSemanticScreen";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import { MessageState } from "../reducers/message";
import { setEditingPoint } from "../actions/editingPointActions";
import {
  pointCreate,
  pointsDelete,
  PointCreateParams,
  PointsDeleteParams,
} from "../actions/messageActions";
import { setExpandedRegion } from "../actions/expandedRegionActions";

import { PointShape, RegionI } from "../dataModels";

const SemanticScreen = (props: {
  message: MessageState;
  readOnly: boolean;
  darkMode: boolean;
  expandedRegion: string;
  setEditingPoint: (pointId: string) => void;
  pointCreate: (params: PointCreateParams) => void;
  pointsDelete: (params: PointsDeleteParams) => void;
  setExpandedRegion: (region: string) => void;
}) => {
  const { message, expandedRegion } = props;

  const author = message.author || {
    name: "anonymous",
    authorId: uuidv4(),
    authorDate: new Date(),
    color: randomColor(),
  };

  const createEmptyPoint = (
    shape: PointShape,
    index: number,
    focus?: boolean
  ) => {
    props.pointCreate({
      point: {
        author: author,
        content: "",
      },
      shape: shape,
      index: index,
      focus: focus,
    });
  };

  const createEmptyFocus = (shape: PointShape) => {
    createEmptyPoint(shape, message.points[shape].length, true);
  };

  const deleteEmptyPoints = () => {
    props.pointsDelete({
      pointIds: Object.values(message.points)
        .flat()
        .filter((p) => !p.content)
        .map((p) => p._id),
    });
  };

  const handleRegionClick = (region: RegionI, expand: boolean): void => {
    if (!expand && region === expandedRegion) {
      props.setExpandedRegion("");
      !props.readOnly && deleteEmptyPoints();
    } else if (expand && region !== expandedRegion) {
      props.setExpandedRegion(region);
      !props.readOnly && deleteEmptyPoints();
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

  const semanticScreenRef = useRef<HTMLDivElement>();

  useEffect(() => {
    semanticScreenRef.current &&
      wrapGrid(semanticScreenRef.current, {
        duration: 150,
        easing: "linear",
      });
  }, []);

  const isExpanded = (region: RegionI) => {
    return region === expandedRegion
      ? "expanded"
      : expandedRegion === ""
      ? "balanced"
      : "minimized";
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <StyledSemanticScreen
        expandedRegion={expandedRegion}
        ref={semanticScreenRef}
        darkMode={props.darkMode}
      >
        {props.readOnly && (
          <Banner
            text={author.name}
            color={author.color}
            placement={{ top: "0", right: "0" }}
            darkMode={props.darkMode}
          />
        )}
        {regions.map((region: RegionI) => {
          if (region === "merits") {
            return (
              <MeritsRegion
                region={region}
                isExpanded={isExpanded(region)}
                onRegionClick={handleRegionClick}
                key={region}
              />
            );
          }
          if (region === "focus") {
            return (
              <FocusRegion
                region={region}
                isExpanded={isExpanded(region)}
                readOnly={props.readOnly}
                author={author}
                point={
                  message.focus
                    ? Object.values(message.points)
                        .flat()
                        .find(
                          (p) => message.focus && p._id === message.focus._id
                        )
                    : undefined
                }
                shape={message.focus ? message.focus.shape : undefined}
                index={
                  message.focus
                    ? message.points[message.focus.shape].findIndex(
                        (p) => message.focus && p._id === message.focus._id
                      )
                    : undefined
                }
                isMainPoint={
                  message.focus && message.main === message.focus._id
                    ? true
                    : false
                }
                createEmptyFocus={createEmptyFocus}
                onRegionClick={handleRegionClick}
                key={region}
                darkMode={props.darkMode}
              />
            );
          } else {
            return (
              <Region
                region={region}
                isExpanded={isExpanded(region)}
                readOnly={props.readOnly}
                author={author}
                points={message.points[region as PointShape]}
                focusPointId={message.focus && message.focus._id}
                mainPointId={message.main}
                createEmptyPoint={createEmptyPoint}
                onRegionClick={handleRegionClick}
                key={region}
                darkMode={props.darkMode}
              />
            );
          }
        })}
      </StyledSemanticScreen>
    </DndProvider>
  );
};

const mapStateToProps = (state: AppState) => ({
  message: state.message,
  expandedRegion: state.expandedRegion.region,
});

const mapDispatchToProps = {
  pointCreate,
  pointsDelete,
  setEditingPoint,
  setExpandedRegion,
};

export default connect(mapStateToProps, mapDispatchToProps)(SemanticScreen);
