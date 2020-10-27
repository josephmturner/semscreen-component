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
//TODO: how to confirm that focus point exists in the array of points
//contained in the semscreen?
import { AuthorsState } from "../reducers/authors";
import { MessagesState } from "../reducers/messages";
import { PointsState } from "../reducers/points";

export const authors: AuthorsState = {
  byId: {
    author0: { _id: "author0", name: "BreatheOutBreatheIn", color: "#209924" },
    author1: { _id: "author1", name: "KindWoman", color: "#7d3989" },
  },
};

export const points: PointsState = {
  byId: {
    pointId1: {
      content: "Online Deliberation",
      _id: "pointId1",
      shape: "topics",
      pointDate: new Date(),
    },
    REFERENCE_TO_pointId1_0: {
      _id: "REFERENCE_TO_pointId1_0",
      referencePointId: "pointId1",
      referenceMessageId: "message0",
      referenceAuthorId: "author0",
    },
    REFERENCE_TO_pointId1_1: {
      _id: "REFERENCE_TO_pointId1_1",
      referencePointId: "pointId1",
      referenceMessageId: "message0",
      referenceAuthorId: "author0",
    },
    pointId2: {
      content:
        "Build an open, collaborative, compassionate system to share information and make decisions",
      _id: "pointId2",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId3: {
      content:
        "Create a frontend which can ride on federated and distributed backends.",
      _id: "pointId3",
      shape: "actions",
      pointDate: new Date(),
    },
    REFERENCE_TO_pointId3: {
      _id: "REFERENCE_TO_pointId3",
      referencePointId: "pointId3",
      referenceMessageId: "message0",
      referenceAuthorId: "author0",
    },
    pointId4: {
      content: "Get plenty of sleep :)",
      _id: "pointId4",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId5: {
      content:
        "Make a p2p deliberation app that runs in node, web browser, and hopefully React Native",
      _id: "pointId5",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId6: {
      content: "Graph database!",
      _id: "pointId6",
      shape: "topics",
      pointDate: new Date(),
    },
    pointId7: {
      content:
        "Brainstorm and implement other components, including a list view of messages",
      _id: "pointId7",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId8: {
      content: "Public-key cryptography makes distributed networking possible",
      _id: "pointId8",
      shape: "thoughts",
      pointDate: new Date(),
    },
    pointId9: {
      content: "Excited!",
      _id: "pointId9",
      shape: "feelings",
      pointDate: new Date(),
    },
    pointId10: {
      content: "Understanding",
      _id: "pointId10",
      shape: "needs",
      pointDate: new Date(),
    },
    pointId11: {
      content: "Peace",
      _id: "pointId11",
      shape: "needs",
      pointDate: new Date(),
    },
  },
};

export const messages: MessagesState = {
  byId: {
    message0: {
      _id: "message0",
      author: "author0",
      shapes: {
        facts: [],
        thoughts: ["pointId8"],
        feelings: [],
        needs: [],
        topics: [],
        actions: ["pointId3"],
        people: [],
      },
      focus: "pointId1",
      main: "pointId3",
      createdAt: new Date(),
      isPersisted: true,
    },
    message1: {
      _id: "message1",
      author: "author1",
      shapes: {
        facts: [],
        thoughts: [],
        feelings: ["pointId9"],
        needs: ["pointId10", "pointId11"],
        topics: [],
        actions: [],
        people: [],
      },
      focus: "REFERENCE_TO_pointId1_0",
      main: "pointId9",
      createdAt: new Date(),
      isPersisted: false,
    },
    message2: {
      _id: "message2",
      author: "author1",
      shapes: {
        facts: [],
        thoughts: [],
        feelings: [],
        needs: [],
        topics: ["pointId6"],
        actions: [
          "pointId2",
          "REFERENCE_TO_pointId3",
          "pointId4",
          "pointId7",
          "pointId5",
        ],
        people: [],
      },
      focus: "REFERENCE_TO_pointId1_1",
      main: "REFERENCE_TO_pointId3",
      createdAt: new Date(),
      isPersisted: false,
    },
  },
  allMessages: ["message0", "message1", "message2"],
};
