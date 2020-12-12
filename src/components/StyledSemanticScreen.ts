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

interface Props {
  expandedRegion: string;
  ref: any;
  BGColor: string;
}

const StyledSemanticScreen = styled.div<Props>`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: grid;
  background-color: ${(props) => props.BGColor};
  border-radius: 3px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  --expanded-size: 4fr;
  --minimized-size: 1fr;

  ${({ expandedRegion }) =>
    expandedRegion === "facts" &&
    `
    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);
    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "merits" &&
    `
    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);
    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "people" &&
    `
    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);
    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "thoughts" &&
    `
    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "focus" &&
    `
    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "actions" &&
    `
    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);
    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "feelings" &&
    `
    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "needs" &&
    `
    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "topics" &&
    `
    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);
    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);
  `}
`;

export default StyledSemanticScreen;
