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
import React, { useEffect, useRef } from "react";
import Media from "react-bootstrap/Media";

//TODO: correct props below
const Point = (props: any) => {
  const { point, messageDispatch, isEditing, setEditingPoint, onClick } = props;

  const pointRef = useRef<HTMLTextAreaElement>(null);

  //TODO: to consider: rewrite useEffect; while it works, !point.content is true for
  //any empty point, not just the newly created one
  useEffect(() => {
    (isEditing || !point.content) &&
      pointRef.current &&
      pointRef.current.focus();
  }, [isEditing, point.content]);

  const handleChange = (e: any) => {
    const content = e.target.value;
    messageDispatch({
      type: "pointUpdate",
      point: { ...point, content: content },
    });
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  const imageUrl = require(`../images/${point.shape}.svg`);

  //TODO: make image not selectable, in placeholder too
  return (
    <Media as="li" onClick={handleClick}>
      <img
        width={20}
        height={20}
        className="mr-3"
        src={imageUrl}
        alt={point.shape}
      />
      <Media.Body>
        <form>
          <textarea
            placeholder={`New ${point.shape.toLowerCase()} point`}
            value={point.content}
            ref={pointRef}
            onChange={handleChange}
            onFocus={() => setEditingPoint(point.pointId)}
            onBlur={() => setEditingPoint("")}
          />
          <button
            type="button"
            onClick={() => {
              messageDispatch({
                type: "pointsDelete",
                pointIds: [point.pointId],
              });
            }}
          >
            ✗
          </button>
        </form>
      </Media.Body>
    </Media>
  );
};

export default Point;
