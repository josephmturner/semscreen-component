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
import { getPointIfReference } from "../dataModels/pointUtils";
import { AppState } from "../reducers/store";

import { useDispatch, useSelector } from "react-redux";
import { endDrag } from "../actions/dragActions";
import { setSelectedPoints } from "../actions/selectPointActions";

export const useDragPoint = (pointId: string, index: number) => {
  const point = useSelector((state: AppState) =>
    getPointIfReference(pointId, state)
  );

  //Ensure that the dragged point is the first item in the array of
  //selectedPoints. When dropping points in the CenterRegion, the first item in the array of
  //selectedPoints is chosen as the new main point.
  const newSelectedPointIds = useSelector((state: AppState) => {
    const selected = state.selectedPoints.pointIds.filter(
      (id) => id !== pointId
    );
    selected.unshift(pointId);
    return selected;
  });

  const dispatch = useDispatch();

  const [, drag, preview] = useDrag({
    item: {
      type: ItemTypes.POINT,
      shape: point.shape,
      index: index,
    },
    begin: () => {
      dispatch(
        setSelectedPoints({
          pointIds: newSelectedPointIds,
        })
      );
    },
    end: () => {
      dispatch(endDrag({}));
    },
  });
  return { drag, preview };
};
