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
import React from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { pointsDelete } from "../actions/pointsActions";

const PointHoverOptions = (props: { pointId: string; darkMode?: boolean }) => {
  const dispatch = useDispatch();

  return (
    <StyledPointHoverOptions darkMode={props.darkMode}>
      <TrashIcon
        onClick={(e: React.MouseEvent) => {
          dispatch(pointsDelete({ pointIds: [props.pointId] }));
          e.stopPropagation();
        }}
        width="0.9rem"
        height="0.9rem"
        viewBox="0 0 16 16"
        fill={props.darkMode ? "white" : "black"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path
          fill-rule="evenodd"
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
        />
      </TrashIcon>
    </StyledPointHoverOptions>
  );
};

const StyledPointHoverOptions = styled.div<{ darkMode?: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  margin: auto;
  top: 0;
  bottom: 0;
  right: 20px;
  height: 1rem;
  z-index: 10;
  background-color: ${(props) => (props.darkMode ? "black" : "white")};
  border-radius: 5px;
`;

const TrashIcon = styled.svg`
  padding: 0 3px;

  :hover {
    background-color: red;
    border-radius: 5px;
  }
`;

export default PointHoverOptions;
