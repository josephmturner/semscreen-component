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
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";
import { PointI, PointShape } from "../dataModels";

export const useDragPoint = (
  point: PointI,
  shape: PointShape,
  index: number
) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.POINT,
      pointId: point._id,
      originalShape: shape,
      originalIndex: index,
      shape: shape,
      index: index,
      quoted: !!point.quotedAuthor,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => {
      return point._id === monitor.getItem().pointId;
    },
  });
  return { isDragging, drag, preview };
};
