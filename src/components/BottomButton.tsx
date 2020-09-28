import React from "react";
import styled from "styled-components";

const BottomButton = (props: { onClick: () => void; darkMode: boolean }) => (
  <StyledSvg
    width="2em"
    height="2em"
    viewBox="0 0 16 16"
    fill={props.darkMode ? "#fff" : "#000"}
    xmlns="http://www.w3.org/2000/svg"
    onClick={props.onClick}
  >
    <path
      fill-rule="evenodd"
      d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
    />
  </StyledSvg>
);

const StyledSvg = styled.svg`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
`;

export default BottomButton;
