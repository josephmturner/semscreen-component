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
import styled from "styled-components";

interface StyledRegionProps {
  backgroundColor: string;
  isExpanded: string;
}

const StyledRegion = styled.div<StyledRegionProps>`
  background-color: ${(props) => props.backgroundColor};
  overflow: auto;
  border: 2px solid lightgray;
  border-radius: 10px;

  @media (max-width: 799px) {
    --minimized-border: 0;
    --minimized-border-radius: 0;
  }

  @media (min-width: 800px) {
    --minimized-border: 2px solid lightgray;
    --minimized-border-radius: 10px;
  }

  ${({ isExpanded }) =>
    isExpanded === "minimized" &&
    `
border: var(--minimized-border);
border-radius: var(--minimized-border-radius);
`}
`;

export default StyledRegion;
