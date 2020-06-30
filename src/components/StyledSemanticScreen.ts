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
//copied directly from u4few-app, nothing modified
import styled from "styled-components";

interface Props {
  color?: string;
  expandedRegion: string;
  showShapes: boolean;
}

const StyledSemanticScreen = styled.div<Props>`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: lightgray;
  color: ${(props) => (props.color ? props.color : "inherit")};
  padding: ${(props) => (props.showShapes ? "2rem" : "0")};
  transition: 0.25s;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;

  @media (max-width: 799px) {
   --expanded-size: 1fr;
   --minimized-size: 0fr;
 }
 
  @media (min-width: 800px) {
   --expanded-size: 4fr;
   --minimized-size: 1fr;
 }
  
  ${({ expandedRegion }) =>
    expandedRegion === "Facts" &&
    `
    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);
    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Merits" &&
    `
    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);
    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "People" &&
    `
    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);
    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Thoughts" &&
    `
    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Focus" &&
    `
    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Actions" &&
    `
    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);
    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Feelings" &&
    `
    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Needs" &&
    `
    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);
    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Topics" &&
    `
    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);
    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);
  `}

  > .Shape {
  opacity: 0.33;
  }

  > #FactsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  }
  > #MeritsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
  }
  > #PeopleShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  top: 0%;
  right: 0%;
  }
  > #ThoughtsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  top: 50%;
  left: 0%;
  transform: translate(0%, -50%);
 }
  > #ActionsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  top: 50%;
  right: 0%;
  transform: translate(0%, -50%);
 }
  > #FeelingsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  bottom: 0%;
  left: 0%;
 }
  > #NeedsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
 }
  > #TopicsShape {
  position: absolute;
  width: 2rem;
  height: 2rem;
  bottom: 0%;
  right: 0%;
 }
`;

export default StyledSemanticScreen;
