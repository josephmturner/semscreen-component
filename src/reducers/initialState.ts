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
import { AuthorI } from "../dataModels";
import { MessageState } from "../reducers/message";

export const authors: AuthorI[] = [
  {
    name: "KindWoman",
    authorDate: new Date(),
    authorId: "1",
    color: "#7d3989",
  },
];

export const messages: MessageState[] = [
  {
    messageId: "messageId1",
    revisionOf: null,
    author: authors[0],
    points: {
      facts: [],
      thoughts: [],
      feelings: [],
      needs: [],
      topics: [
        {
          author: authors[0],
          content: "Online Deliberation",
          pointId: "pointId1",
          pointDate: new Date(),
        },
      ],
      actions: [
        {
          author: authors[0],
          content:
            "Build an open, collaborative, compassionate system to share information and make decisions",
          pointId: "pointId2",
          pointDate: new Date(),
        },
        {
          author: authors[0],
          content:
            "Create a frontend which can ride on federated and distributed backends, such as IPFS.",
          pointId: "pointId3",
          pointDate: new Date(),
        },
        {
          author: authors[0],
          content:
            "Build an open, collaborative, compassionate system to share information and make decisions",
          pointId: "pointId4",
          pointDate: new Date(),
        },
        {
          author: authors[0],
          content:
            "Build an open, collaborative, compassionate system to share information and make decisions",
          pointId: "pointId5",
          pointDate: new Date(),
        },
        {
          author: authors[0],
          content:
            "Create a frontend which can ride on federated and distributed backends, such as IPFS.",
          pointId: "pointId6",
          pointDate: new Date(),
        },
        {
          author: authors[0],
          content:
            "Build an open, collaborative, compassionate system to share information and make decisions (main point)",
          pointId: "pointId7",
          pointDate: new Date(),
        },
      ],
      people: [],
    },
    focus: { pointId: "pointId1", shape: "topics" },
    main: "pointId7",
    createdAt: new Date(),
  },
];
