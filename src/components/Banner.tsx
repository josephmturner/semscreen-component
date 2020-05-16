import React from 'react';
import styled from 'styled-components';

//correct props type
const Banner = (props: any) => {
  const semscreen = props.semscreen;

  function handleClick() {
    window.alert('you clicked the banner');
  }

  return (
    <>
      <BannerView color={semscreen.styles.textColor} onClick={handleClick}>
        {semscreen.username || 'No selected hat'}
      </BannerView>
    </>
  );
};

const BannerView = styled.div`
  position: absolute;
  text-align: center;
  font-size: 1.5rem;
  top: -0.75rem;
  right: 0.5rem;
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
