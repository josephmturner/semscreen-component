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
import * as React from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import { XYCoord } from "dnd-core";

interface Props {
  children: React.ReactElement | React.ReactElement[];
  index: number;
  appDispatch: any;
}

const PointDropContainer = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, pointDropRef] = useDrop({
    accept: ItemTypes.POINT,
    drop: (item: DraggablePointType) => {
      console.log("dropped");
    },

    hover(item: DraggablePointType, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action

      const point = item.point;

      props.appDispatch({
        type: "pointUpdate",
        point: point,
        move: {
          oldShape: point.shape,
          newShape: point.shape,
          oldIndex: dragIndex,
          newIndex: hoverIndex,
        },
      });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  pointDropRef(ref);

  return <div ref={ref}>{props.children}</div>;
};

export default PointDropContainer;
