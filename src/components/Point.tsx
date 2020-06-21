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
import React, { useEffect, useState } from "react";
import Media from "react-bootstrap/Media";

//TODO: correct props below
const Point = (props: any) => {
  const { pointRef, onSubmit, onClick, onPointDelete } = props;

  const [point, setPoint] = useState(props.point);

  const [isEditing, setIsEditing] = useState(props.isEditing);

  useEffect(() => {
    isEditing && pointRef.current && pointRef.current.focus();
  }, [isEditing]);

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
    setIsEditing(props.isEditing);
    if (point.content) {
      onSubmit(point);
    } else if (!point.content) {
      onPointDelete(point.pointId);
    }
  };

  const imageUrl = require(`../images/${point.shape}.svg`);

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
          {!isEditing && (
            <div onClick={() => setIsEditing(true)}>{point.content}</div>
          )}
          {isEditing && (
            <textarea
              placeholder={`New ${point.shape.toLowerCase()} point`}
              value={point.content}
              ref={pointRef}
              onChange={handleChange}
              onClick={() => setIsEditing(true)}
              onBlur={handleBlur}
            />
          )}
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
              onPointDelete(point.pointId);
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
