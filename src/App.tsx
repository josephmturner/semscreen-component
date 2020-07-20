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
import update from "immutability-helper";
import SemanticScreen from "./components/SemanticScreen";
import { messages } from "./constants/initialState";
import {
  AppI,
  AppReducerAction,
  PointShape,
  allPointShapes,
  PointI,
  PointsI,
} from "./constants/AppState";

//TODO: check for \n in submitted point.content and remove it
const appReducer = (appState: AppI, action: AppReducerAction) => {
  const newPointId = uuidv4();
  switch (action.type) {
    case "pointCreate":
      const newPoints = appState.message.points[action.shape].slice();
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
                [action.shape]: newPoints,
              },
              focus: { pointId: newPointId, shape: action.shape },
            },
            editingPoint: newPointId,
          }
        : {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.shape]: newPoints,
              },
            },
            editingPoint: newPointId,
          };
    case "pointUpdate":
      return {
        ...appState,
        message: {
          ...appState.message,
          points: {
            ...appState.message.points,
            [action.shape]: appState.message.points[action.shape].map((p) => {
              if (p.pointId === action.point.pointId) {
                return action.point;
              }
              return p;
            }),
          },
        },
      };
    case "pointMove":
      const pointWithNewShape = appState.message.points[action.oldShape].find(
        (p) => p.pointId === action.pointId
      ) as PointI;
      return action.oldShape === action.newShape
        ? {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.oldShape]: update(
                  appState.message.points[action.oldShape],
                  {
                    $splice: [
                      [action.oldIndex, 1],
                      [action.newIndex, 0, pointWithNewShape],
                    ],
                  }
                ),
              },
            },
          }
        : {
            ...appState,
            message: {
              ...appState.message,
              points: {
                ...appState.message.points,
                [action.oldShape]: update(
                  appState.message.points[action.oldShape],
                  {
                    $splice: [[action.oldIndex, 1]],
                  }
                ),
                [action.newShape]: update(
                  appState.message.points[action.newShape],
                  {
                    $splice: [[action.newIndex, 0, pointWithNewShape]],
                  }
                ),
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
      const combinedPoints = appState.message.points[action.shape].slice();
      action.aboveOrBelow === "above" &&
        combinedPoints.splice(action.index - 1, 2, {
          ...appState.message.points[action.shape][action.index - 1],
          content:
            appState.message.points[action.shape][action.index - 1].content +
            appState.message.points[action.shape][action.index].content,
        });
      action.aboveOrBelow === "below" &&
        combinedPoints.splice(action.index, 2, {
          ...appState.message.points[action.shape][action.index],
          content:
            appState.message.points[action.shape][action.index].content +
            appState.message.points[action.shape][action.index + 1].content,
        });
      const newCursorPosition =
        action.aboveOrBelow === "above"
          ? {
              pointId:
                appState.message.points[action.shape][action.index - 1].pointId,
              index:
                appState.message.points[action.shape][action.index - 1].content
                  .length,
            }
          : {
              pointId:
                appState.message.points[action.shape][action.index].pointId,
              index:
                appState.message.points[action.shape][action.index].content
                  .length,
            };
      return {
        ...appState,
        message: {
          ...appState.message,
          points: {
            ...appState.message.points,
            [action.shape]: combinedPoints,
          },
        },
        cursorPosition: newCursorPosition,
      };
    case "splitIntoTwoPoints":
      const splitPoints = appState.message.points[action.shape].slice();
      splitPoints.splice(
        action.index,
        1,
        {
          ...appState.message.points[action.shape][action.index],
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
            [action.shape]: splitPoints,
          },
        },
        cursorPosition: { pointId: newPointId, index: 0 },
      };
    case "setFocus":
      return {
        ...appState,
        message: {
          ...appState.message,
          focus: { pointId: action.pointId, shape: action.shape },
        },
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
