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
import React from "react";

const ChooseShapes = (props: {
  handleClick: (shape: string, e: any) => void;
}) => {
  const { handleClick } = props;

  return (
    <ul>
      {[
        "facts",
        "people",
        "thoughts",
        "actions",
        "feelings",
        "needs",
        "topics",
      ].map((shape) => (
        <li key={shape}>
          <button
            onClick={(e) => handleClick(shape, e)}
          >{`new ${shape} focus point`}</button>
        </li>
      ))}
    </ul>
  );
};

export default ChooseShapes;
