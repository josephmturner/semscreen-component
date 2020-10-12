"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.points = exports.authors = void 0;

var _randomcolor = _interopRequireDefault(require("randomcolor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Copyright (C) 2020 by USHIN, Inc.

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
//TODO: how to confirm that focus point exists in the array of points
//contained in the semscreen?
var authors = [//TODO: add Ids to authors
{
  name: "anonymous",
  color: (0, _randomcolor.default)()
}, {
  name: "KindWoman",
  color: "#7d3989"
}, {
  name: "BreatheOutBreatheIn",
  color: "#209924"
}];
exports.authors = authors;
var points = {
  byId: {
    pointId1: {
      content: "Online Deliberation",
      _id: "pointId1",
      shape: "topics",
      pointDate: new Date()
    },
    pointId6: {
      content: "Graph database!",
      _id: "pointId6",
      shape: "topics",
      pointDate: new Date()
    },
    pointId2: {
      content: "Build an open, collaborative, compassionate system to share information and make decisions",
      _id: "pointId2",
      shape: "actions",
      pointDate: new Date()
    },
    pointId3: {
      // TODO: replace authors with authorIds
      quotedAuthor: authors[2],
      content: "Create a frontend which can ride on federated and distributed backends.",
      _id: "pointId3",
      shape: "actions",
      pointDate: new Date()
    },
    REFERENCE_TO_pointId3: {
      _id: "REFERENCE_TO_pointId3",
      referencePointId: "pointId3",
      referenceMessageId: "messageId0"
    },
    pointId4: {
      content: "Get plenty of sleep :)",
      _id: "pointId4",
      shape: "actions",
      pointDate: new Date()
    },
    pointId7: {
      content: "Brainstorm and implement other components, including a list view of messages",
      _id: "pointId7",
      shape: "actions",
      pointDate: new Date()
    },
    pointId5: {
      content: "Make a p2p deliberation app that runs in node, web browser, and hopefully React Native",
      _id: "pointId5",
      shape: "actions",
      pointDate: new Date()
    }
  }
};
exports.points = points;
var messages = [{
  _id: "messageId1",
  author: authors[1],
  shapes: {
    facts: [],
    thoughts: [],
    feelings: [],
    needs: [],
    topics: ["pointId6"],
    actions: ["pointId2", "REFERENCE_TO_pointId3", "pointId4", "pointId7", "pointId5"],
    people: []
  },
  focus: "pointId1",
  main: "pointId5",
  createdAt: new Date()
}];
exports.messages = messages;