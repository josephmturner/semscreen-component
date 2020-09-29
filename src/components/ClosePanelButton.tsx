import React from "react";
import styled from "styled-components";

const ClosePanelButton = (props: {
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
        d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"
      />
    )}
    {props.side === "bottom" && (
      <path
        fill-rule="evenodd"
        d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"
      />
    )}
  </StyledSvg>
);

interface StyledProps {
  side: string;
}

const StyledSvg = styled.svg<StyledProps>`
  position: absolute;
  ${(props) =>
    props.side === "right" &&
    `
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
  `}
  ${(props) =>
    props.side === "bottom" &&
    `
  right: 0;
  left: 0;
  top: 0;
  margin: 0 auto;
  `}
`;

export default ClosePanelButton;
