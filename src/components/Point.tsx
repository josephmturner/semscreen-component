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
import React, { useRef } from "react";
import Media from "react-bootstrap/Media";
import ContentEditable from "react-contenteditable";

//TODO: correct props below
const Point = (props: any) => {
  const { point, onPointClick } = props;
  const onPointChange = props.onPointChange;

  const content = useRef(point.content);

  const handleChange = (e: any) => {
    content.current = e.target.value;
  };
  const handleBlur = () => {
    // TODO: Only call onPointChange when content has actually changed.
    point.content = content.current;
    onPointChange(point);
  };
  const handleClick = (e: any) => {
    e.stopPropagation();
    onPointClick();
  };

  const imageUrl = require(`../images/${point.shape}.svg`);

  return (
    <Media as="li">
      <img
        width={20}
        height={20}
        className="mr-3"
        src={imageUrl}
        alt={point.shape}
      />
      <Media.Body>
        <ContentEditable
          onClick={handleClick}
          suppressContentEditableWarning={true}
          html={content.current}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Media.Body>
    </Media>
  );
};

export default Point;
