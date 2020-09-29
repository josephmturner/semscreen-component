import React from "react";
import styled from "styled-components";

const OpenPanelButton = (props: {
  side: string;
  onClick: () => void;
  darkMode: boolean;
}) => (
  <StyledSvg
    width="2em"
    height="2em"
    viewBox="0 0 16 16"
    stroke={props.darkMode ? "#7e7e7e" : "#696969"}
    strokeWidth="1px"
    xmlns="http://www.w3.org/2000/svg"
    onClick={props.onClick}
    side={props.side}
  >
    {props.side === "right" && (
      <path
        fill-rule="evenodd"
        d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"
      />
    )}
    {props.side === "bottom" && (
      <path
        fill-rule="evenodd"
        d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
      />
    )}
  </StyledSvg>
);

interface StyledProps {
  side: string;
}
const StyledSvg = styled.svg<StyledProps>`
  position: absolute;
  z-index: 999;
  ${(props) =>
    props.side === "right" &&
    `
  top: 0;
  right: 0.5rem;
  bottom: 0;
  margin: auto 0;
`}
  ${(props) =>
    props.side === "bottom" &&
    `
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
`}
`;

export default OpenPanelButton;
