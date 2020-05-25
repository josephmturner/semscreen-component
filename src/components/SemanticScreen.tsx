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
import React from 'react';
import Region from './Region';
import Banner from './Banner';
import StyledSemanticScreen from './StyledSemanticScreen';
import ShapesRim from './ShapesRim';
import { MessageI } from '../interfaces';

const SemanticScreen = (props: { messageInitialState: MessageI; showShapes: boolean; }) => {
  const messageInitialState = props.messageInitialState;
  const points = messageInitialState.points || [];
  const showShapes = props.showShapes;
  const regionNames = ["Facts", "Merits", "People", "Thoughts", "Focus", "Actions", "Feelings", "Needs", "Topics"];
  
  return (
    <StyledSemanticScreen
      id="rim"
      color={messageInitialState.author.styles.textColor}
      showShapes={showShapes}
    >
      <Banner author={messageInitialState.author} showShapes={showShapes}/>
      {regionNames.map(region =>
        <Region 
          styles={messageInitialState.author.styles}
          points={points.filter(p => p.shape === region)}
          key={region}
        />)
      }
      <ShapesRim showShapes={showShapes}/>
    </StyledSemanticScreen>
  );
};

export default SemanticScreen;
