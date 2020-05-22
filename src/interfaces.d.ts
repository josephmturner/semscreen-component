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
interface AuthorI {
  name: string;
  styles: {
    textColor: string;
    backgroundColor: string; 
  };
  authorId: string;
  authorDate: Date;
}

interface PointI {
  author: AuthorI;
  content: string;
  shape: string;
  pointId: string;
  pointDate: Date
}

//TODO: validate that focus points are contained in the points array
interface MessageI {
  author: AuthorI;
  points?: PointI[];
  focus: PointI[];
  mainPoint: PointI;
  messageId: string;
  messageDate: Date;
}

export { AuthorI, PointI, MessageI };
