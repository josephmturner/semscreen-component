import React from "react";
import styled from "styled-components";

const CloseButton = (props: { onClick: () => void; darkMode: boolean }) => (
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
      d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"
    />
  </StyledSvg>
);

const StyledSvg = styled.svg`
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  margin: 0 auto;
`;

export default CloseButton;
