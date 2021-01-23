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
import styled from "styled-components";
import { blackOrWhite } from "../../dataModels/pointUtils";

interface StyledProps {
  darkMode?: boolean;
  isSelected?: boolean;
  red?: boolean;
}

export const Button = styled.svg<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  fill: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    ${(props) =>
      props.red
        ? `
      background-color: red;`
        : `
      fill: var(--colorBG);
      background-color: var(--colorFG);
    `}
  }
`;
