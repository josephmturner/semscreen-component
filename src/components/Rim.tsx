import React from 'react';
import Region from './Region';
import Banner from './Banner';
import RimView from './RimView';
import { MessageI } from '../interfaces';

const Rim = (props: { message: MessageI }) => {
  const message = props.message;
  const points = message.points || [];

  return (
    <RimView
      id="rim"
      color={message.author.styles.textColor}
    >
      <Banner author={message.author}/>
      <Region regionName="Facts" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Facts")}/>
      <Region regionName="Merits" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Merits")}/>
      <Region regionName="People" styles={ message.author.styles } points={points.filter(p =>  p.shape === "People")}/>
      <Region regionName="Thoughts" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Thoughts")}/>
      <Region regionName="Focus" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Focus")}/>
      <Region regionName="Actions" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Actions")}/>
      <Region regionName="Feelings" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Feelings")}/>
      <Region regionName="Needs" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Needs")}/>
      <Region regionName="Topics" styles={ message.author.styles } points={points.filter(p =>  p.shape === "Topics")}/>
    </RimView>
  );
};

export default Rim;
