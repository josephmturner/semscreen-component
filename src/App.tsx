/*
  Copyright (C) 2019 by USHIN, Inc.

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
import React, { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import SemanticScreen from "./components/SemanticScreen";
import { messages } from "./constants/initialState";
import {
  AppI,
  AppReducerAction,
  PointShape,
  allPointShapes,
  PointsI,
} from "./constants/AppState";

//TODO: check for \n in submitted point.content and remove it
const appReducer = (appState: AppI, action: AppReducerAction) => {
  switch (action.type) {
    case "pointCreate":
      const newPointId = uuidv4();
      const newPoints = appState.message.points[action.point.shape].slice();
      newPoints.splice(action.index, 0, {
        ...action.point,
        pointId: newPointId,
        pointDate: new Date(),
      });
      return action.focus
        ? {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.point.shape]: newPoints,
              },
              focus: newPointId,
            },
            editingPoint: newPointId,
          }
        : {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.point.shape]: newPoints,
              },
            },
            editingPoint: newPointId,
          };
    case "pointUpdate":
      return action.move
        ? {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.move.oldShape]: appState.message.points[
                  action.move.oldShape
                ].splice(action.move.oldIndex, 1),
                [action.move.newShape]: appState.message.points[
                  action.move.newShape
                ].splice(action.move.newIndex, 0, action.point),
              },
            },
          }
        : {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.point.shape]: appState.message.points[
                  action.point.shape
                ].map((p) => {
                  if (p.pointId === action.point.pointId) {
                    return action.point;
                  }
                  return p;
                }),
              },
            },
          };
    case "pointsDelete":
      return {
        ...appState,
        message: {
          ...appState.message,
          points: allPointShapes.reduce(
            (obj: PointsI, pointShape: PointShape) => {
              obj[pointShape] = appState.message.points[pointShape].filter(
                (p) => {
                  return !action.pointIds.includes(p.pointId);
                }
              );
              return obj;
            },
            appState.message.points
          ),
        },
      };
    case "setFocus":
      return {
        ...appState,
        message: { ...appState.message, focus: action.pointId },
      };
    case "setEditingPoint":
      return { ...appState, editingPoint: action.pointId };
    case "noEditingPoint":
      return { ...appState, editingPoint: "" };
    default:
      return appState;
  }
};

const App = () => {
  const showShapes = true;
  const [appState, appDispatch] = useReducer(appReducer, {
    message: messages[0],
    editingPoint: "",
  });
  //TODO: how to type appState

  return (
    <SemanticScreen
      message={appState.message}
      editingPoint={appState.editingPoint}
      appDispatch={appDispatch}
      showShapes={showShapes}
      onAuthorUpdate={console.log}
    />
  );
};

export default App;
