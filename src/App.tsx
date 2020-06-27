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
import { MessageI, PointI } from "./interfaces";

type Action =
  | { type: "pointCreate"; point: PointI }
  | { type: "pointUpdate"; point: PointI }
  | { type: "pointsDelete"; pointIds: string[] }
  | { type: "setFocus"; pointId: string };

const messageReducer = (message: MessageI, action: Action) => {
  switch (action.type) {
    case "pointCreate":
      return {
        ...message,
        points: [
          ...message.points,
          {
            ...action.point,
            pointId: uuidv4(),
            pointDate: new Date(),
          },
        ],
      };
    case "pointUpdate":
      return {
        ...message,
        points: message.points.map((p) => {
          if (p.pointId === action.point.pointId) {
            return action.point;
          }
          return p;
        }),
      };
    case "pointsDelete":
      return {
        ...message,
        points: message.points.filter(
          (p) => p.pointId && !action.pointIds.includes(p.pointId)
        ),
      };
    case "setFocus":
      return { ...message, focus: action.pointId };
    default:
      throw new Error();
  }
};

const App = () => {
  const showShapes = true;
  const [message, messageDispatch] = useReducer(messageReducer, messages[0]);

  return (
    <SemanticScreen
      message={message}
      messageDispatch={messageDispatch}
      showShapes={showShapes}
      onAuthorUpdate={console.log}
    />
  );
};

export default App;
