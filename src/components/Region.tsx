import React from 'react'; 
import Point from './Point';
import styled from 'styled-components';

const Region = (props: {regionName: string, styles: { backgroundColor: string; textColor: string; }, points: any }) => {
 const points = props.points || []; 
 const styles = props.styles;

 //TODO: add author to initialstate, interfaces, and below
  return (
   <StyledRegion backgroundColor={styles.backgroundColor}>
  <ul className="list-unstyled">
   {points.map((p : any) => <Point content={ p.content } shape={p.shape} id={p.id} />)}
  </ul>
 </StyledRegion>
 )
}

interface StyledRegionProps {
  backgroundColor: string;
}

const StyledRegion = styled.div<StyledRegionProps>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
  overflow: auto;
`
export default Region;

