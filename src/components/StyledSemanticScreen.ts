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
  --active-size: 18fr;
  height: 100%;
  width: 100%;
  position: relative;
  display: grid;
  grid-gap: 6px;
  grid-template-areas:
    'facts merits people'
    'thoughts . actions'
    'feelings needs topics';

  background-color: lightgray;
  color: ${(props) => (props.color ? props.color : "inherit")};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  padding: ${(props) => (props.showShapes ? "2rem" : "0")};
  transition: 0.5s;

  ${({ expandedRegion }) =>
    expandedRegion === "Facts" &&
    `
    grid-template-columns: var(--active-size) 1fr 1fr;
    grid-template-rows: var(--active-size) 1fr 1fr;
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Merits" &&
    `
    grid-template-columns: 1fr var(--active-size) 1fr;
    grid-template-rows: var(--active-size) 1fr 1fr;
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "People" &&
    `
    grid-template-columns: 1fr 1fr var(--active-size);
    grid-template-rows: var(--active-size) 1fr 1fr;
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Thoughts" &&
    `
    grid-template-columns: var(--active-size) 1fr 1fr;
    grid-template-rows: 1fr var(--active-size) 1fr;
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Focus" &&
    `
    grid-template-columns: 1fr var(--active-size) 1fr;
    grid-template-rows: 1fr var(--active-size) 1fr;
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Actions" &&
    `
    grid-template-columns: 1fr 1fr var(--active-size);
    grid-template-rows: 1fr var(--active-size) 1fr;
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Feelings" &&
    `
    grid-template-columns: var(--active-size) 1fr 1fr;
    grid-template-rows: 1fr 1fr var(--active-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Needs" &&
    `
    grid-template-columns: 1fr var(--active-size) 1fr;
    grid-template-rows: 1fr 1fr var(--active-size);
  `}

  ${({ expandedRegion }) =>
    expandedRegion === "Topics" &&
    `
    grid-template-columns: 1fr 1fr var(--active-size);
    grid-template-rows: 1fr 1fr var(--active-size);
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
