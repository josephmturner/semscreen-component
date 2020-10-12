/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React, { useState } from "react";
import { PointShape } from "../dataModels/dataModels";

function SevenShapes(props: {
  onShapeClick: (shape: PointShape) => void;
  darkMode?: boolean;
}) {
  let strokeColor = "#000";
  if (props.darkMode) {
    strokeColor = "#fff";
  }

  const [hoveredShape, setHoveredShape] = useState<PointShape | null>(null);

  return (
    <svg width={"14em"} height={"70%"} viewBox="0 0 119.063 119.063">
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="prefix__b">
          <path d="M0 360h360V0H0z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="prefix__f">
          <path d="M0 360h360V0H0z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="prefix__d">
          <path d="M0 360h360V0H0z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="prefix__a">
          <path d="M0 360h360V0H0z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="prefix__g">
          <path d="M0 360h360V0H0z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="prefix__c">
          <path d="M0 360h360V0H0z" />
        </clipPath>
        <clipPath id="prefix__e" clipPathUnits="userSpaceOnUse">
          <path d="M0 360h360V0H0z" />
        </clipPath>
      </defs>
      <g
        clipPath="url(#prefix__a)"
        transform="matrix(.12214 0 0 -.1078 37.386 114.46)"
      >
        <path
          d="M310.288 66.209c3.895-9.738-3.477-18.67-13.804-18.67H67.574c-10.328 0-21.056 11.656-14.043 21.008l105.974 226.358c4.197 10.278 12.196 18.947 22.523 18.947 10.328 0 17.624-8.018 23.063-19.725z"
          onClick={(e) => {
            e.stopPropagation();
            props.onShapeClick("needs");
          }}
          fill="#5f5c5d"
          onMouseEnter={() => setHoveredShape("needs")}
          onMouseLeave={() => setHoveredShape(null)}
          stroke={hoveredShape === "needs" ? strokeColor : "none"}
          strokeWidth={hoveredShape === "needs" ? "10%" : "none"}
          pointerEvents="visible"
        />
      </g>
      <g
        clipPath="url(#prefix__b)"
        transform="matrix(.09099 0 0 -.1033 78.414 73.833)"
      >
        <path
          d="M335.667 177.789c0-5.664-1.123-9.625-3.04-12.91-1.894-3.287-4.58-5.915-7.715-8.873L202.678 37.165c-11.899-1.078-15.99 4.612-15.99 15.917v6.467H42.27c-10.333 0-18.702 8.975-18.702 20.054V277.63c0 11.055 8.369 20.054 18.702 20.054h144.418v6.367c0 11.305 8.182 19.702 17.251 14.614L323.744 198.92c7.271-10.102 11.923-9.826 11.923-21.131"
          fill="#5f5c5d"
          onClick={(e) => {
            e.stopPropagation();
            props.onShapeClick("actions");
          }}
          onMouseEnter={() => setHoveredShape("actions")}
          onMouseLeave={() => setHoveredShape(null)}
          stroke={hoveredShape === "actions" ? strokeColor : "none"}
          strokeWidth={hoveredShape === "actions" ? "10%" : "none"}
          pointerEvents="visible"
        />
      </g>
      <g
        clipPath="url(#prefix__c)"
        transform="matrix(.09516 0 0 -.09935 6.508 74.581)"
      >
        <path
          d="M322.235 193.242c0-78.539-63.669-142.209-142.206-142.209-78.538 0-142.206 63.67-142.206 142.21 0 78.536 63.668 142.204 142.206 142.204 78.537 0 142.206-63.668 142.206-142.205"
          fill="#5f5c5d"
          onClick={(e) => {
            e.stopPropagation();
            props.onShapeClick("thoughts");
          }}
          onMouseEnter={() => setHoveredShape("thoughts")}
          onMouseLeave={() => setHoveredShape(null)}
          stroke={hoveredShape === "thoughts" ? strokeColor : "none"}
          strokeWidth={hoveredShape === "thoughts" ? "10%" : "none"}
          pointerEvents="visible"
        />
      </g>
      <g
        clipPath="url(#prefix__d)"
        transform="matrix(.09854 0 0 -.10289 12.894 108.011)"
      >
        <path
          d="M350.235 230.912c0-24.512-9.98-46.712-26.105-62.722L215.922 56.586c-7.23-7.207-18.919-7.207-26.15 0L82.534 167.243c-16.68 16.078-27.052 38.67-27.052 63.669 0 48.86 39.595 88.478 88.456 88.478 22.616 0 43.27-8.502 58.91-22.478 15.64 13.976 36.29 22.478 58.908 22.478 48.857 0 88.478-39.618 88.478-88.478"
          fill="#5f5c5d"
          onClick={(e) => {
            e.stopPropagation();
            props.onShapeClick("feelings");
          }}
          onMouseEnter={() => setHoveredShape("feelings")}
          onMouseLeave={() => setHoveredShape(null)}
          stroke={hoveredShape === "feelings" ? strokeColor : "none"}
          strokeWidth={hoveredShape === "feelings" ? "10%" : "none"}
          pointerEvents="visible"
        />
      </g>
      <g
        clipPath="url(#prefix__e)"
        transform="matrix(-.09492 0 0 .09911 106.877 71.053)"
      >
        <path
          d="M336.17 61.98c0-10.329-8.374-18.702-18.702-18.702H88.556c-10.327 0-18.7 8.373-18.7 18.701L97.541 290.89c0 10.33 8.373 18.7 18.701 18.7H277.54c10.328 0 18.701-8.37 18.701-18.7z"
          fill="#5f5c5d"
          onClick={(e) => {
            e.stopPropagation();
            props.onShapeClick("topics");
          }}
          onMouseEnter={() => setHoveredShape("topics")}
          onMouseLeave={() => setHoveredShape(null)}
          stroke={hoveredShape === "topics" ? strokeColor : "none"}
          strokeWidth={hoveredShape === "topics" ? "10%" : "none"}
          pointerEvents="visible"
        />
      </g>
      <path
        d="M36.138 34.182c0 .998-.775 1.807-1.73 1.807H13.23c-.955 0-1.73-.809-1.73-1.807V12.071c0-.998.775-1.807 1.73-1.807h21.178c.955 0 1.73.809 1.73 1.807z"
        fill="#5f5c5d"
        onClick={(e) => {
          e.stopPropagation();
          props.onShapeClick("facts");
        }}
        onMouseEnter={() => setHoveredShape("facts")}
        onMouseLeave={() => setHoveredShape(null)}
        stroke={hoveredShape === "facts" ? strokeColor : "none"}
        //TODO: why 1% and not 2%, like the rest of the shapes?
        strokeWidth={hoveredShape === "facts" ? "1%" : "none"}
        pointerEvents="visible"
      />
      <g>
        <g
          clipPath="url(#prefix__g)"
          transform="matrix(.10231 0 0 -.0965 75.502 40.765)"
        >
          <path
            d="M313.526 86.652c-2.253-7.606-7.417-13.437-18.7-16.876 0 0-59.102-22.9-114.456 0-55.355 22.902-114.453 0-114.453 0-10.33 0-18.702 7.553-18.702 16.876v206.55c4.183 9.244 10.008 13.986 18.775 17.461 0 0 51.427 25.129 114.38-.585 62.803-25.654 114.455 0 114.455 0 10.33 0 18.701-7.556 18.701-16.876z"
            fill="#5f5c5d"
            onClick={(e) => {
              e.stopPropagation();
              props.onShapeClick("people");
            }}
            onMouseEnter={() => setHoveredShape("people")}
            onMouseLeave={() => setHoveredShape(null)}
            stroke={hoveredShape === "people" ? strokeColor : "none"}
            strokeWidth={hoveredShape === "people" ? "10%" : "none"}
            pointerEvents="visible"
          />
        </g>
      </g>
    </svg>
  );
}

export default SevenShapes;
