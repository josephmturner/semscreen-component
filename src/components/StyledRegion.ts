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

interface StyledRegionProps {
  borderColor: string;
}

export const StyledRegion = styled.div<StyledRegionProps>`
  overflow: hidden;
  border: 2px solid ${(props) => props.borderColor};
  border-radius: 3px;
`;

//This container ensures that StyledRegion only ever has one child,
//which is a requirement of animate-css-grid
export const InnerContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  height: 100%;
  flex-direction: column;
`;
