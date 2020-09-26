"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = void 0;

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
var messages = [{
  _id: "messageId1",
  author: {
    name: "KindWoman",
    color: "#7d3989"
  },
  points: {
    facts: [],
    thoughts: [],
    feelings: [],
    needs: [],
    topics: [{
      content: "Online Deliberation",
      _id: "pointId1",
      pointDate: new Date()
    }, {
      content: "Graph database!",
      _id: "pointId6",
      pointDate: new Date()
    }],
    actions: [{
      content: "Build an open, collaborative, compassionate system to share information and make decisions",
      _id: "pointId2",
      pointDate: new Date()
    }, {
      quotedAuthor: {
        name: "BreatheOutBreatheIn",
        color: "#209924"
      },
      content: "Create a frontend which can ride on federated and distributed backends.",
      _id: "pointId3",
      pointDate: new Date()
    }, {
      content: "Get plenty of sleep :)",
      _id: "pointId4",
      pointDate: new Date()
    }, {
      content: "Brainstorm and implement other components, including a list view of messages",
      _id: "pointId7",
      pointDate: new Date()
    }, {
      content: "Make a p2p deliberation app that runs in node, web browser, and hopefully React Native",
      _id: "pointId5",
      pointDate: new Date()
    }],
    people: []
  },
  focus: {
    _id: "pointId1",
    shape: "topics"
  },
  main: "pointId5",
  createdAt: new Date()
}];
exports.messages = messages;