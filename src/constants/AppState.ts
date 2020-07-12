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

//TODO: make script in package.json for running typescript

//TODO: move interfaces.d.ts to constants dir and rename to AppState,
//create new interface called AppState which contains message and
//whatever else
export type PointShape =
  | "facts"
  | "thoughts"
  | "feelings"
  | "needs"
  | "topics"
  | "actions"
  | "people";

export const allPointShapes: PointShape[] = [
  "facts",
  "thoughts",
  "feelings",
  "needs",
  "topics",
  "actions",
  "people",
];

export type PointShapeWithEmpty = PointShape | "";

export type RegionI = PointShape | "merits" | "focus";

export interface AuthorI {
  name: string;
  styles: {
    textColor: string;
    backgroundColor: string;
  };
  authorId: string;
  authorDate: Date;
}

export interface PointI {
  author: AuthorI;
  content: string;
  shape: PointShape;
  pointId: string;
  pointDate: Date;
}

//make PointI extend PointNoIdI, if possible
export interface PointNoIdI {
  author: AuthorI;
  content: string;
  shape: PointShape;
}

export type PointsI = {
  [shape in PointShape]: PointI[];
};

export interface MessageI {
  messageId: string;
  revisionOf: string | null;
  author: AuthorI;
  points: PointsI;
  focus: string;
  main: string;
  createdAt: Date;
}

export interface CursorPositionI {
  pointId: string;
  index: number;
}

export interface AppI {
  message: MessageI;
  editingPoint: PointI["pointId"] | undefined;
  cursorPosition?: CursorPositionI | undefined;
}

export type AppReducerAction =
  | {
      type: "pointCreate";
      point: PointNoIdI;
      index: number;
      focus?: boolean;
    }
  | {
      type: "pointUpdate";
      point: PointI;
      move?: {
        oldShape: PointShape;
        oldIndex: number;
        newShape: PointShape;
        newIndex: number;
      };
    }
  | { type: "pointsDelete"; pointIds: string[] }
  | {
      type: "combinePoints";
      aboveOrBelow: "above" | "below";
      point: PointI;
      index: number;
    }
  | {
      type: "splitIntoTwoPoints";
      topPoint: PointI;
      bottomPoint: PointI;
      index: number;
    }
  | { type: "setFocus"; pointId: string }
  | { type: "setMainPoint"; pointId: string }
  | { type: "setEditingPoint"; pointId: string }
  | { type: "setCursorPosition"; pointId: string; index: number }
  | { type: "resetCursorPosition" };

//TODO: rename setFocus case in appReducer
//TODO: validate that focus points are contained in the points array
