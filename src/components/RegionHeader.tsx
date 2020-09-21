import React from "react";
import { PointShape } from "../dataModels";
import styled from "styled-components";

const RegionHeader = (props: { shape: PointShape }) => {
  const imageUrl = require(`../images/${props.shape}.svg`);

  return (
    <StyledSpan style={{ color: "white", margin: "auto", fontSize: "small" }}>
      <img src={imageUrl} height={17} />
      {props.shape.slice(0, 1).toUpperCase() + props.shape.slice(1)}
    </StyledSpan>
  );
};

const StyledSpan = styled.span`
  display: flex;
  align-items: justify;
`;
export default RegionHeader;
