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
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import SemanticScreen from "./components/SemanticScreen";
import { messages } from "./constants/initialState";
import { MessageI, PointI } from "./interfaces";

const App = () => {
  const showShapes = true;

  const [message, setMessage] = useState<MessageI>(messages[0]);

  const handlePointCreate = (newPoint: PointI) => {
    const p = {
      ...newPoint,
      pointId: uuidv4(),
      pointDate: new Date(),
    };
    const updatedPoints = [...message.points, p];
   setMessage((message) => ({...message, points: updatedPoints}));
  };

  const handlePointUpdate = (updatedPoint: PointI) => {
    const updatedPoints = message.points.map((p) => {
      if (p.pointId === updatedPoint.pointId) {
        return updatedPoint;
      }
      return p;
    });
    setMessage((message) => ({...message, points: updatedPoints}));
  };

  const handlePointDelete = (pointId: string) => {
    const updatedPoints = message.points.filter((p) => p.pointId !== pointId);
    setMessage((message) => ({...message, points: updatedPoints}));
  };

  return (
    <SemanticScreen
      message={message}
      showShapes={showShapes}
      onAuthorUpdate={console.log}
      onPointCreate={handlePointCreate}
      onPointUpdate={handlePointUpdate}
      onPointDelete={handlePointDelete}
    />
  );
};

export default App;
