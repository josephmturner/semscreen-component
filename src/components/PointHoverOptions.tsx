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
import { setMainPoint } from "../actions/messagesActions";

const PointHoverOptions = (props: { pointId: string; darkMode?: boolean }) => {
  const dispatch = useDispatch();

  return (
    <StyledPointHoverOptions darkMode={props.darkMode}>
      <MainPointIcon
        viewBox="0 0 512 512"
        darkMode={props.darkMode}
        onClick={(e: React.MouseEvent) => {
          dispatch(setMainPoint({ pointId: props.pointId }));
          e.stopPropagation();
        }}
      >
        <path d="M469.333 64H42.667C19.135 64 0 83.135 0 106.667v298.667C0 428.865 19.135 448 42.667 448h426.667C492.865 448 512 428.865 512 405.333V106.667C512 83.135 492.865 64 469.333 64zM42.667 85.333h426.667c1.572 0 2.957.573 4.432.897-36.939 33.807-159.423 145.859-202.286 184.478-3.354 3.021-8.76 6.625-15.479 6.625s-12.125-3.604-15.49-6.635C197.652 232.085 75.161 120.027 38.228 86.232c1.478-.324 2.866-.899 4.439-.899zm-21.334 320V106.667c0-2.09.63-3.986 1.194-5.896 28.272 25.876 113.736 104.06 169.152 154.453C136.443 302.671 50.957 383.719 22.46 410.893c-.503-1.814-1.127-3.588-1.127-5.56zm448 21.334H42.667c-1.704 0-3.219-.594-4.81-.974 29.447-28.072 115.477-109.586 169.742-156.009a7980.773 7980.773 0 0018.63 16.858c8.792 7.938 19.083 12.125 29.771 12.125s20.979-4.188 29.76-12.115a8178.815 8178.815 0 0018.641-16.868c54.268 46.418 140.286 127.926 169.742 156.009-1.591.38-3.104.974-4.81.974zm21.334-21.334c0 1.971-.624 3.746-1.126 5.56-28.508-27.188-113.984-108.227-169.219-155.668 55.418-50.393 140.869-128.57 169.151-154.456.564 1.91 1.194 3.807 1.194 5.897v298.667z" />
      </MainPointIcon>
      <TrashIcon
        onClick={(e: React.MouseEvent) => {
          dispatch(pointsDelete({ pointIds: [props.pointId] }));
          e.stopPropagation();
        }}
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

const MainPointIcon = styled.svg<{ darkMode?: boolean }>`
  padding: 0 3px;
  width: 0.9rem;
  height: 0.9rem;
  fill: ${(props) => (props.darkMode ? "white" : "black")};

  :hover {
    fill: ${(props) => (props.darkMode ? "black" : "white")};
    background-color: ${(props) => (props.darkMode ? "white" : "black")};
    border-radius: 5px;
  }
`;

const TrashIcon = styled.svg`
  width: 0.9rem;
  height: 0.9rem;
  padding: 0 3px;

  :hover {
    background-color: red;
    border-radius: 5px;
  }
`;

export default PointHoverOptions;
