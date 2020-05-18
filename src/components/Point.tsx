import React from 'react'; 
import Media from 'react-bootstrap/Media';

const Point = (props: any) => {
 const { content, shape, id } = props;

 return (
  <Media as="li">
    <img
      width={10}
      height={10}
      className="mr-3"
      src={ require('../images/banner.png') }
    />
    <Media.Body>
     <p>{content}</p>
     <p>{id}</p>
    </Media.Body>
  </Media>
 )
}


export default Point;
