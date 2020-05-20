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
      <Region regionName="Facts" points={points.filter(p =>  p.shape === "Facts")}/>
      <Region regionName="Merits" points={points.filter(p =>  p.shape === "Merits")}/>
      <Region regionName="People" points={points.filter(p =>  p.shape === "People")}/>
      <Region regionName="Thoughts" points={points.filter(p =>  p.shape === "Thoughts")}/>
      <Region regionName="Focus" points={points.filter(p =>  p.shape === "Focus")}/>
      <Region regionName="Actions" points={points.filter(p =>  p.shape === "Actions")}/>
      <Region regionName="Feelings" points={points.filter(p =>  p.shape === "Feelings")}/>
      <Region regionName="Needs" points={points.filter(p =>  p.shape === "Needs")}/>
      <Region regionName="Topics" points={points.filter(p =>  p.shape === "Topics")}/>
    </RimView>
  );
};

export default Rim;
