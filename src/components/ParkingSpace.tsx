import React from "react";
import styled from "styled-components";
import CloseBottomPanel from "./CloseBottomPanel";

const ParkingSpace = (props: {
  closeButton: () => void;
  darkMode: boolean;
}) => (
  <StyledParkingSpace darkMode={props.darkMode}>
    <CloseBottomPanel onClick={props.closeButton} darkMode={props.darkMode} />
  </StyledParkingSpace>
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
