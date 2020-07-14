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
  const newPointId = uuidv4();
  switch (action.type) {
    case "pointCreate":
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

      if (action.move) {
        const oldShapeNewPoints = appState.message.points[action.move.oldShape].slice();
        oldShapeNewPoints.splice(action.move.oldIndex, 1);

        const newShapeNewPoints = appState.message.points[action.move.newShape].slice();

        if (action.move.oldShape === action.move.newShape) {
          newShapeNewPoints.splice(action.move.oldIndex, 1);
        }
        newShapeNewPoints.splice(action.move.newIndex, 0, action.point);

        return {
          ...appState,
          message: {
            ...appState.message,
            points: {
              ...appState.message.points,
              [action.move.oldShape]: oldShapeNewPoints,
              [action.move.newShape]: newShapeNewPoints,
            },
          },
        };
      }

      return {
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
    case "combinePoints":
      const combinedPoints = appState.message.points[
        action.point.shape
      ].slice();
      action.aboveOrBelow === "above" &&
        combinedPoints.splice(action.index - 1, 2, {
          ...appState.message.points[action.point.shape][action.index - 1],
          content:
            appState.message.points[action.point.shape][action.index - 1]
              .content +
            appState.message.points[action.point.shape][action.index].content,
        });
      action.aboveOrBelow === "below" &&
        combinedPoints.splice(action.index, 2, {
          ...appState.message.points[action.point.shape][action.index],
          content:
            appState.message.points[action.point.shape][action.index].content +
            appState.message.points[action.point.shape][action.index + 1]
              .content,
        });
      const newCursorPosition =
        action.aboveOrBelow === "above"
          ? {
              pointId:
                appState.message.points[action.point.shape][action.index - 1]
                  .pointId,
              index:
                appState.message.points[action.point.shape][action.index - 1]
                  .content.length,
            }
          : {
              pointId:
                appState.message.points[action.point.shape][action.index]
                  .pointId,
              index:
                appState.message.points[action.point.shape][action.index]
                  .content.length,
            };
      return {
        ...appState,
        message: {
          ...appState.message,
          points: {
            ...appState.message.points,
            [action.point.shape]: combinedPoints,
          },
        },
        cursorPosition: newCursorPosition,
      };
    case "splitIntoTwoPoints":
      const splitPoints = appState.message.points[
        action.topPoint.shape
      ].slice();
      splitPoints.splice(
        action.index,
        1,
        {
          ...appState.message.points[action.topPoint.shape][action.index],
          content: action.topPoint.content,
        },
        { ...action.bottomPoint, pointId: newPointId, pointDate: new Date() }
      );
      return {
        ...appState,
        message: {
          ...appState.message,
          points: {
            ...appState.message.points,
            [action.topPoint.shape]: splitPoints,
          },
        },
        cursorPosition: { pointId: newPointId, index: 0 },
      };
    case "setFocus":
      return {
        ...appState,
        message: { ...appState.message, focus: action.pointId },
      };
    case "setMainPoint":
      return {
        ...appState,
        message: { ...appState.message, main: action.pointId },
      };
    case "setEditingPoint":
      return { ...appState, editingPoint: action.pointId };
    //TODO: globally, distinguish pointsArrayIndex from pointContentIndex, currently both are labeled 'index'
    case "setCursorPosition":
      return {
        ...appState,
        cursorPosition: { pointId: action.pointId, index: action.index },
      };
    case "resetCursorPosition":
      return {
        ...appState,
        cursorPosition: undefined,
      };
    default:
      return appState;
  }
};

const App = () => {
  const showShapes = true;
  const [appState, appDispatch] = useReducer(appReducer, {
    message: messages[0],
    editingPoint: undefined,
    cursorPosition: undefined,
  });
  //TODO: how to type appState

  //TODO: make editingPoint optional in AppI, then instead of passing empty
  //strings to it, pass undefined.
  return (
    <SemanticScreen
      message={appState.message}
      editingPoint={appState.editingPoint}
      cursorPosition={appState.cursorPosition}
      appDispatch={appDispatch}
      showShapes={showShapes}
      onAuthorUpdate={console.log}
    />
  );
};

export default App;
