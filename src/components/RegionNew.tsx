import React from 'react'; 
import ListGroup from 'react-bootstrap/ListGroup'; 

const RegionNew = (props: any) => {
 const semscreen = props.semscreen; 
 return (
  <ListGroup>
   <ListGroup.Item>{semscreen.points[0].content}</ListGroup.Item>
   <ListGroup.Item>{semscreen.points[1].content}</ListGroup.Item>
   <ListGroup.Item>{semscreen.points[2].content}</ListGroup.Item>
   <ListGroup.Item>{semscreen.points[3].content}</ListGroup.Item>
   <ListGroup.Item>{semscreen.points[4].content}</ListGroup.Item>
  </ListGroup> 
 )
}
export default RegionNew;

