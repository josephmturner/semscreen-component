/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/

//TODO: make script in package.json for running typescript
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
  color: string;
}

export interface PointI {
  quotedAuthor?: AuthorI;
  content: string;
  _id: string;
  pointDate: Date;
}

//make PointI extend PointNoIdI, if possible
export interface PointNoIdI {
  author: AuthorI;
  content: string;
}

export type PointsI = {
  [shape in PointShape]: PointI[];
};

export interface CursorPositionI {
  pointId: string;
  index: number;
}

//TODO: rename setFocus case in appReducer
//TODO: validate that focus points are contained in the points array
