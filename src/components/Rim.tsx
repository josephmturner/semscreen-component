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
import RimView from './RimView';
import ShapesRim from './ShapesRim';
import { MessageI } from '../interfaces';

const Rim = (props: { message: MessageI; showShapes: boolean; }) => {
  const message = props.message;
  const points = message.points || [];
  const showShapes = props.showShapes;
  
  return (
    <RimView
      id="rim"
      color={message.author.styles.textColor}
      showShapes={showShapes}
    >
      <Banner author={message.author} showShapes={showShapes}/>
      <Region regionName="Facts" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Facts")}/>
      <Region regionName="Merits" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Merits")}/>
      <Region regionName="People" styles={ message.author.styles } points={points.filter(p =>  p.shape === "People")}/>
      <Region regionName="Thoughts" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Thoughts")}/>
      <Region regionName="Focus" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Focus")}/>
      <Region regionName="Actions" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Actions")}/>
      <Region regionName="Feelings" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Feelings")}/>
      <Region regionName="Needs" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Needs")}/>
      <Region regionName="Topics" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Topics")}/>
      <ShapesRim showShapes={showShapes}/>
    </RimView>
  );
};

export default Rim;
