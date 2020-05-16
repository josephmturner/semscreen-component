import React from 'react';
import Region from './Region';
import Banner from './Banner';
import RimView from './RimView';
// correct props type
const Rim = (props: any) => {
  const semscreen = props.semscreen;

  return (
    <RimView
      id="rim"
      color={semscreen.styles.textColor}
    >
      <Banner semscreen={semscreen}/>
      <Region regionName="Facts" semscreen={semscreen}/>
      <Region regionName="Merits" semscreen={semscreen}/>
      <Region regionName="People" semscreen={semscreen}/>
      <Region regionName="Thoughts" semscreen={semscreen}/>
      <Region regionName="Focus" semscreen={semscreen}/>
      <Region regionName="Actions" semscreen={semscreen}/>
      <Region regionName="Feelings" semscreen={semscreen}/>
      <Region regionName="Needs" semscreen={semscreen}/>
      <Region regionName="Topics" semscreen={semscreen}/>
    </RimView>
  );
};

export default Rim;
