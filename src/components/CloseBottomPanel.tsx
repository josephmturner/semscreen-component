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
      d="M3.646 11.854a.5.5 0 0 0 .708 0L8 8.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708zM2.4 5.2c0 .22.18.4.4.4h10.4a.4.4 0 0 0 0-.8H2.8a.4.4 0 0 0-.4.4z"
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
