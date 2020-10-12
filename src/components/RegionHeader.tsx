import React from "react";
import { PointShape } from "../dataModels";
import styled from "styled-components";

const RegionHeader = (props: { shape: PointShape; darkMode?: boolean }) => {
  const imageUrl = require(`../images/${props.shape}.svg`);

  return (
    <StyledSpan darkMode={props.darkMode}>
      <img src={imageUrl} height={17} alt={props.shape} />
      {props.shape.slice(0, 1).toUpperCase() + props.shape.slice(1)}
    </StyledSpan>
  );
};

interface StyledProps {
  darkMode?: boolean;
}

const StyledSpan = styled.span<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: "#000";
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};
`;
export default RegionHeader;
