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
  borderColor: string;
}

const StyledRegion = styled.div<StyledRegionProps>`
  overflow: hidden;
  &:hover {
    overflow-y: auto;
  }

  border: 2px solid ${(props) => props.borderColor};
  border-radius: 7px;
  margin: 0.5px;

  & > div {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`;

export default StyledRegion;
