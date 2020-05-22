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
