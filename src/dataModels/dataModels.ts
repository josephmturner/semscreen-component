/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
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

export function isPointShape(region: string): region is PointShape {
  return (allPointShapes as string[]).includes(region);
}

export type PointShapeWithEmpty = PointShape | "";

export type RegionI = PointShape | "merits" | "focus";

export interface AuthorI {
  _id: string;
  name: string;
  color: string;
}

//make PointI extend PointNoIdI, if possible
// TODO: move this inside PointCreateParams, and then delete
export interface PointNoIdI {
  author: AuthorI;
  content: string;
  shape: PointShape;
}

export interface PointI {
  content: string;
  _id: string;
  shape: PointShape;
  pointDate: Date;
}

export interface PointReferenceI {
  _id: string;
  referencePointId: string;
  referenceMessageId: string;
  referenceAuthorId: string;
}

export type ShapesI = {
  [shape in PointShape]: string[];
};

export interface CursorPositionI {
  pointId: string;
  index: number;
}

//TODO: rename setFocus case in appReducer
//TODO: validate that focus points are contained in the points array
