import React from 'react';
import Region from './Region';
import Banner from './Banner';
import RimView from './RimView';
import { SemscreenI } from '../interfaces';

const Rim = (props: {semscreen: SemscreenI}) => {
  const semscreen = props.semscreen;
  const points = semscreen.points || [];

  return (
    <RimView
      id="rim"
      color={semscreen.styles.textColor}
    >
      <Banner semscreen={semscreen}/>
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
