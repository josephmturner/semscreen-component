/*
  Copyright (C) 2021 by USHIN, Inc.

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

  setCurrentMessage: "setCurrentMessage",
  draftMessageCreate: "draftMessageCreate",
  draftMessageDelete: "draftMessageDelete",

  setAuthors: "setAuthors",

  draftPointCreate: "draftPointCreate",
  draftPointReferencesCreate: "draftPointReferencesCreate",
  draftPointUpdate: "draftPointUpdate",
  pointsMoveWithinMessage: "pointsMoveWithinMessage",
  pointsMoveToMessage: "pointsMoveToMessage",
  draftPointsDelete: "draftPointsDelete",
  setMain: "setMain",
  combinePoints: "combinePoints",
  splitIntoTwoPoints: "splitIntoTwoPoints",

  beginDrag: "beginDrag",
  hoverOver: "hoverOver",
  endDrag: "endDrag",

  setExpandedRegion: "setExpandedRegion",

  setSelectedPoints: "setSelectedPoints",
  togglePoint: "togglePoint",
  selectAllPoints: "selectAllPoints",
  deselectAllPoints: "deselectAllPoints",

  togglePanel: "togglePanel",

  loadDatabase: "loadDatabase",
  populateMessageAndPoints: "populateMessageAndPoints",
  searchByContent: "searchByContent",
  publishMessage: "publishMessage",

  userIdentityLoad: "userIdentityLoad",

  displayApp: "displayApp",
};
