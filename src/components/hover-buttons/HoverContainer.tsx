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

import { blackOrWhite } from "../../dataModels/pointUtils";

interface Props {
  darkMode?: boolean;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export const HoverContainer = (props: Props) => (
  <StyledHoverContainer isSelected={props.isSelected} darkMode={props.darkMode}>
    {props.children}
  </StyledHoverContainer>
);

interface StyledProps {
  darkMode?: boolean;
  isSelected?: boolean;
}

const StyledHoverContainer = styled.div<StyledProps>`
  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  position: absolute;
  display: flex;
  align-items: center;
  margin: auto;
  top: 0;
  bottom: 0;
  right: -0.5rem;
  height: 1rem;
  z-index: 10;
  background-color: var(--colorBG);
  border: 1px solid var(--colorFG);
  border-radius: 3px;
`;
