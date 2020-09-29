import React from "react";
import styled from "styled-components";

const ParkingSpace = (props: { darkMode: boolean }) => (
  <StyledParkingSpace darkMode={props.darkMode}></StyledParkingSpace>
);

interface StyledProps {
  darkMode: boolean;
}

const StyledParkingSpace = styled.div<StyledProps>`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: ${(props) => (props.darkMode ? "#000" : "#fff")};
`;

export default ParkingSpace;
