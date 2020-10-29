import React from "react";
import styled from "styled-components";
import { AuthorI, PointShape } from "../dataModels/dataModels";

interface Props {
  shape: PointShape;
  referenceAuthor?: AuthorI;
  darkMode?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const MainPointShape = (props: Props) => {
  //TODO: fix irregular svgs - actions should not be in a group
  //TODO: (create Shape svg component and) import shape svgs from there
  //TODO: replace envelope svg with skinnier svg
  return (
    <StyledSvg
      viewBox="0 0 16 16"
      fill={props.darkMode ? "white" : "black"}
      referenceAuthor={props.referenceAuthor}
      onClick={props.onClick}
    >
      <path
        fillRule="evenodd"
        d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 002 13h12a1 1 0 00.966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"
      />
      {props.shape === "actions" && (
        <g transform="matrix(.02436 0 0 -.0229 3.95 12.104)" strokeWidth={25}>
          <path
            d="M335.667 178.148c0-5.282-1.123-8.976-3.04-12.039-1.894-3.065-4.58-5.516-7.715-8.275L202.678 47.007c-11.899-1.005-15.99 4.301-15.99 14.844v6.031H42.27c-10.333 0-18.702 8.37-18.702 18.702v184.672c0 10.31 8.369 18.701 18.702 18.701h144.418v5.938c0 10.543 8.182 18.373 17.251 13.628l119.805-111.669c7.271-9.42 11.923-9.163 11.923-19.706"
            fill="#d1d3d4"
            stroke="#000"
          />
        </g>
      )}
      {props.shape === "facts" && (
        <path
          d="M5.065 5.548c0-.228.184-.412.412-.412h5.046c.228 0 .412.184.412.412v5.046a.412.412 0 01-.412.412H5.477a.412.412 0 01-.412-.412z"
          fill="#d1d3d4"
          stroke="#000"
          stroke-width=".8"
        />
      )}
      {props.shape === "feelings" && (
        <path
          d="M11.847 7.045a2.15 2.15 0 01-.682 1.565l-2.824 2.783a.5.5 0 01-.683 0L4.86 8.633a2.153 2.153 0 01-.706-1.588c0-1.218 1.034-2.206 2.31-2.206.59 0 1.128.212 1.537.56.408-.348.947-.56 1.537-.56 1.276 0 2.31.988 2.31 2.206"
          fill="#d1d3d4"
          stroke="#000"
          stroke-width=".8"
        />
      )}
      {props.shape === "needs" && (
        <path
          d="M11.012 10.805c.092.233-.08.446-.322.446H5.336c-.241 0-.492-.279-.328-.502l2.478-5.41c.098-.245.285-.452.527-.452.242 0 .412.191.54.471z"
          fill="#d1d3d4"
          stroke="#000"
          stroke-width=".8"
        />
      )}
      {props.shape === "people" && (
        <path
          d="M11.087 10.306c-.052.174-.172.307-.434.385 0 0-1.37.521-2.653 0-1.283-.522-2.653 0-2.653 0-.24 0-.434-.172-.434-.385V5.602a.718.718 0 01.435-.397S6.541 4.632 8 5.218c1.456.584 2.653 0 2.653 0 .24 0 .434.172.434.384z"
          fill="#d1d3d4"
          stroke="#000"
          stroke-width=".8"
        />
      )}
      {props.shape === "thoughts" && (
        <path
          d="M4.661 8a3.339 3.339 0 116.678 0A3.339 3.339 0 014.66 8"
          fill="#d1d3d4"
          stroke="#000"
          stroke-width=".8"
        />
      )}
      {props.shape === "topics" && (
        <path
          d="M4.909 5.016c-.254 0-.46.194-.46.434l.982 5.309c0 .24.206.434.46.434h4.218c.254 0 .46-.194.46-.434l.982-5.309c0-.24-.206-.434-.46-.434H5.46z"
          fill="#d1d3d4"
          stroke="#000"
          stroke-width=".8"
        />
      )}
    </StyledSvg>
  );
};

export const StyledSvg = styled.svg<{ referenceAuthor?: AuthorI }>`
  position: absolute;
  height: 20px;
  top: ${(props) => (props.referenceAuthor ? "1rem" : 0)};
  left: ${(props) => (props.referenceAuthor ? "0.75rem" : "0.5rem")};
`;
