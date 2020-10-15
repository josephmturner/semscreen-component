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
export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const Actions = {
  setCursorPosition: "setCursorPosition",
  clearCursorPosition: "clearCursorPosition",

  setMessage: "setMessage",
  pointCreate: "pointCreate",
  pointUpdate: "pointUpdate",
  pointMove: "pointMove",
  pointsDelete: "pointsDelete",
  setFocus: "setFocus",
  setMainPoint: "setMainPoint",
  combinePoints: "combinePoints",
  splitIntoTwoPoints: "splitIntoTwoPoints",

  setExpandedRegion: "setExpandedRegion",

  setSelectedPoints: "setSelectedPoints",
  togglePoint: "togglePoint",
  selectAllPoints: "selectAllPoints",
  deselectAllPoints: "deselectAllPoints",

  showPanel: "showPanel",
  hidePanel: "hidePanel",
};
