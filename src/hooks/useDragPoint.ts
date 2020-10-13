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
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";
import { PointI } from "../dataModels/dataModels";
import { getPointById } from "../dataModels/getters";
import { AppState } from "../reducers/store";

import { useSelector } from 'react-redux'

export const useDragPoint = (pointId: string, index?: number) => {

  const point = useSelector((state: AppState) => getPointById(pointId, state.points));

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.POINT,
      pointId,
      shape: point.shape,
      index: index,
      originalShape: point.shape,
      quoted: !!point.quotedAuthor,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => {
      return pointId === monitor.getItem().pointId;
    },
  });
  return { isDragging, drag, preview };
};
