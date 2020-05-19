import React from 'react'; 
import Media from 'react-bootstrap/Media';

const Point = (props: any) => {
 const { content, shape, id } = props;
 const imageUrl = require(`../images/${shape}.svg`);

 return (
  <Media as="li">
    <img
      width={20}
      height={20}
      className="mr-3"
      src={imageUrl}
      alt={shape}
    />
    <Media.Body>
     <p>{content}</p>
    </Media.Body>
  </Media>
 )
}


export default Point;
