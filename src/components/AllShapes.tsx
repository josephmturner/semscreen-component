import React from "react";
import styled from "styled-components";

import { PointShape } from "../dataModels/dataModels";
import { blackOrWhite } from "../dataModels/pointUtils";

interface AllProps {
  shape: PointShape;
  isMainPoint?: boolean;
  isSelected?: boolean;
  darkMode?: boolean;
}

const AllShapes = React.forwardRef<SVGSVGElement, AllProps>(
  ({ shape, isMainPoint, isSelected, darkMode }, ref) => {
    const ShapePath = () => {
      switch (shape) {
        case "actions":
          return (
            <path d="M419.584 227.315c0 6.602-1.404 11.22-3.8 15.048-2.368 3.832-5.725 6.895-9.644 10.344L253.348 391.241c-14.874 1.256-19.988-5.376-19.988-18.555v-7.539H52.837c-12.916 0-23.377-10.462-23.377-23.377V110.93c0-12.887 10.461-23.377 23.378-23.377H233.36v-7.422c0-13.179 10.227-22.967 21.564-17.035L404.68 202.682c9.089 11.775 14.904 11.454 14.904 24.633" />
          );
        case "facts":
          return (
            <path d="M391.605 359.26c0 12.91-10.464 23.376-23.375 23.376H82.093c-12.91 0-23.378-10.466-23.378-23.376V73.123c0-12.91 10.468-23.377 23.378-23.377H368.23c12.911 0 23.375 10.467 23.375 23.377z" />
          );
        case "feelings":
          return (
            <path d="M409.448 166.79c0 30.64-12.475 58.39-32.631 78.403l-135.26 139.505c-9.038 9.008-23.649 9.008-32.689 0L74.823 246.376c-20.85-20.097-33.815-48.338-33.815-79.586 0-61.075 49.494-110.597 110.57-110.597 28.27 0 54.086 10.627 73.636 28.097 19.552-17.47 45.364-28.097 73.637-28.097 61.071 0 110.597 49.522 110.597 110.597" />
          );
        case "needs":
          return (
            <path d="M387.86 367.239c4.869 12.172-4.346 23.337-17.255 23.337H84.466c-12.908 0-26.318-14.57-17.552-26.26L199.38 81.37c5.247-12.848 15.245-23.684 28.154-23.684 12.91 0 22.03 10.022 28.829 24.656z" />
          );
        case "people":
          return (
            <path d="M391.908 347.474c-2.816 9.508-9.271 16.797-23.376 21.095 0 0-73.876 28.625-143.069 0-69.194-28.627-143.066 0-143.066 0-12.913 0-23.378-9.44-23.378-21.095V89.287c5.229-11.555 12.51-17.483 23.469-21.826 0 0 64.284-31.412 142.975.73 78.504 32.068 143.069 0 143.069 0 12.911 0 23.376 9.446 23.376 21.096z" />
          );
        case "thoughts":
          return (
            <path d="M402.794 216.251c0 98.174-79.586 177.761-177.757 177.761-98.173 0-177.758-79.587-177.758-177.76 0-98.172 79.585-177.757 177.758-177.757 98.171 0 177.757 79.585 177.757 177.756" />
          );
        case "topics":
          return (
            <path d="M57.895 80.752c0-12.91 10.466-23.376 23.376-23.376h286.14c12.909 0 23.375 10.466 23.375 23.376L356.18 366.891c0 12.911-10.466 23.375-23.376 23.375H131.18c-12.91 0-23.376-10.464-23.376-23.375z" />
          );
      }
    };

    return (
      <StyledSvg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 450 450"
        isMainPoint={isMainPoint}
        isSelected={isSelected}
        darkMode={darkMode}
        ref={ref}
      >
        <ShapePath />
      </StyledSvg>
    );
  }
);

interface StyledProps {
  isMainPoint?: boolean;
  isSelected?: boolean;
  darkMode?: boolean;
}

const StyledSvg = styled.svg<StyledProps>`
  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};

  height: ${(props) => (props.isMainPoint ? "1.5em" : "1em")};
  width: ${(props) => (props.isMainPoint ? "1.5em" : "1em")};
  fill: var(--colorFG);
`;

export default AllShapes;
