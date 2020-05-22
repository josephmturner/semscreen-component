import React from 'react';
import styled from 'styled-components';
import { AuthorI } from '../interfaces';

//correct props type
const Banner = (props: { author: AuthorI; showShapes: boolean}) => {
  const author = props.author;
  const showShapes = props.showShapes;

  function handleClick() {
    window.alert('you clicked the banner');
  }

  return (
    <>
      <BannerView color={author.styles.textColor} onClick={handleClick} showShapes={showShapes}>
        {author.name || 'anonymous (no author)'}
      </BannerView>
    </>
  );
};

interface Props {
  showShapes: boolean;
}

const BannerView = styled.div<Props>`
  position: absolute;
  text-align: center;
  font-size: 1.5rem;
  top: ${props => props.showShapes ? "0.75rem" : "0"};
  right: ${props => props.showShapes ? "2rem" : "0"};
  padding: 0;
  z-index: 1;
  cursor: pointer;
  color: ${props => (props.color ? props.color : 'inherit')};

  &:before {
    content: '';
    position: absolute;
    background-image: url(${require('../images/banner.png')});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: opacity(0.33);
  }
`;

export default Banner;
