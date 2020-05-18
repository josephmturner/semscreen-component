import React from 'react'; 
import Point from './Point';

const Region = (props: {regionName: string, points: any}) => {
 const points = props.points || []; 

 //TODO: add author to initialstate, interfaces, and below
  return (
  <ul className="list-unstyled">
   {points.map((p : any) => <Point content={ p.content } shape={p.shape} id={p.id} />)}
  </ul>
 )
}


export default Region;

