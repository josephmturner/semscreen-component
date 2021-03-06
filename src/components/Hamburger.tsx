/*
  Copyright (C) 2021 by USHIN, Inc.

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
import { blackOrWhite } from "../dataModels/pointUtils";

interface Props {
  onMouseEnter: (e: React.MouseEvent) => void;
  darkMode?: boolean;
  isSelected?: boolean;
}

export const Hamburger = (props: Props) => {
  return (
    <StyledSvg
      onMouseEnter={props.onMouseEnter}
      viewBox="0 0 16 16"
      darkMode={props.darkMode}
      isSelected={props.isSelected}
    >
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </StyledSvg>
  );
};

type StyledProps = Omit<Props, "onMouseEnter">;

const StyledSvg = styled.svg<StyledProps>`
  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};

  position: absolute;
  margin: auto;
  fill: var(--colorFG);
  top: 0;
  bottom: 0;
  right: -1rem;
  height: 1rem;
  z-index: 9;
`;
