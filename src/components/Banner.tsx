/*
  Copyright (C) 2021 by USHIN, Inc.

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
import React from "react";
import styled from "styled-components";

import { blackOrWhite, isUserIdentity } from "../dataModels/pointUtils";
import { AuthorI } from "../dataModels/dataModels";

import { connect } from "react-redux";
import { AppState } from "../reducers";

interface Placement {
  top: string;
  right?: string;
  left?: string;
}

interface OwnProps {
  authorId: string;
  placement: Placement;
  fontSize?: string;
  darkMode?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
}

interface AllProps extends OwnProps {
  author: AuthorI;
}

const Banner = React.forwardRef<HTMLDivElement, AllProps>((props, ref) => (
  <BannerView
    color={props.author.color}
    onClick={console.log}
    top={props.placement.top}
    right={props.placement ? props.placement.right : undefined}
    left={props.placement ? props.placement.left : undefined}
    fontSize={props.fontSize}
    darkMode={props.darkMode}
    isHovered={props.isHovered}
    isSelected={props.isSelected}
    ref={ref}
  >
    {/* \u00A0 adds extra spaces on either side of the text */}
    {`\u00A0 ${props.author.name} \u00A0`}
  </BannerView>
));

interface BannerViewProps extends Placement {
  fontSize?: string;
  darkMode?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
}

const BannerView = styled.div<BannerViewProps>`
  position: absolute;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};

  color: var(--colorFG);
  background-color: transparent;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "small")};
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  left: ${(props) => props.left};
  z-index: 1;
  cursor: pointer;

  &:before {
    content: "";
    position: absolute;
    background-image: ${(props) =>
      `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='450' width='450' preserveAspectRatio='none'> <path d='M391.908 347.474c-2.816 9.508-9.271 16.797-23.376 21.095 0 0-73.876 28.625-143.069 0-69.194-28.627-143.066 0-143.066 0-12.913 0-23.378-9.44-23.378-21.095V89.287c5.229-11.555 12.51-17.483 23.469-21.826 0 0 64.284-31.412 142.975.73 78.504 32.068 143.069 0 143.069 0 12.911 0 23.376 9.446 23.376 21.096z' fill=${
        //For some reason, putting var(--colorBG) as the value of fill
        //doesn't render the correct fill color when a point is selected.
        //This is the same logic written out again...
        props.isSelected
          ? props.darkMode
            ? "'white'"
            : "'black'"
          : props.darkMode
          ? "'black'"
          : "'white'"
      } stroke='${
        props.isHovered
          ? props.darkMode
            ? "white"
            : "black"
          : props.color && props.color.replace("#", "%23")
      }' stroke-width='1.5' vector-effect='non-scaling-stroke'/></svg>")`};
    background-repeat: no-repeat;
    background-size: 133% 120%;
    background-position: center;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const author = isUserIdentity(ownProps.authorId, state)
    ? state.userIdentities.byId[ownProps.authorId]
    : state.authors.byId[ownProps.authorId];
  return {
    author,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Banner);
