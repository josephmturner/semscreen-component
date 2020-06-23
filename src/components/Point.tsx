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
import React, { useEffect, useRef, useState } from "react";
import Media from "react-bootstrap/Media";

//TODO: correct props below
const Point = (props: any) => {
  const { isEditing, setIsEditing, onSubmit, onClick, onPointsDelete } = props;

  const [point, setPoint] = useState(props.point);

  const pointRef = useRef<HTMLTextAreaElement>(null);

  //TODO: to consider: rewrite useEffect; while it works, !point.content is true for
  //any empty point, not just the newly created one
  useEffect(() => {
    (isEditing || !point.content) &&
      pointRef.current &&
      pointRef.current.focus();
  }, []);

  const handleChange = (e: any) => {
    const content = e.target.value;
    setPoint((point: any) => ({ ...point, content: content }));
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  const handleSubmit = (e: any) => {
    if (point.content) {
      onSubmit(point);
    } else {
      console.log("empty point submitted");
    }
    e.preventDefault();
  };

  const handleBlur = () => {
    setIsEditing("");
    onSubmit(point);
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
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder={`New ${point.shape.toLowerCase()} point`}
            value={point.content}
            ref={pointRef}
            onChange={handleChange}
            onFocus={() => setIsEditing(point.pointId)}
            onBlur={handleBlur}
          />
          {isEditing && point.content && <input type="submit" value="✓" />}
          <button
            type="button"
            onClick={() => {
              // the following line serves to remove the content from the textarea
              // of a point which has not yet been created. We ought to find a
              // better way since this is redundant for deleting points which
              // already have an id. It may also lead to unintended consequences
              // down the road.
              setPoint((point: any) => ({ ...point, content: "" }));
              onPointsDelete([point.pointId]);
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
