import React from 'react';
import RegionNew from './RegionNew';
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
      <RegionNew regionName="Facts" semscreen={semscreen}/>
      <RegionNew regionName="Merits" semscreen={semscreen}/>
      <RegionNew regionName="People" semscreen={semscreen}/>
      <RegionNew regionName="Thoughts" semscreen={semscreen}/>
      <RegionNew regionName="Focus" semscreen={semscreen}/>
      <RegionNew regionName="Actions" semscreen={semscreen}/>
      <RegionNew regionName="Feelings" semscreen={semscreen}/>
      <RegionNew regionName="Needs" semscreen={semscreen}/>
      <RegionNew regionName="Topics" semscreen={semscreen}/>
    </RimView>
  );
};

export default Rim;
