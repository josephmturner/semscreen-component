/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import React from "react";
import styled from "styled-components";
import { AuthorI } from "../dataModels";

//correct props type
const Banner = (props: {
  author: AuthorI;
  showShapes: boolean;
  onAuthorUpdate: (e: any) => void;
}) => {
  const author = props.author;
  const showShapes = props.showShapes;

  function handleClick() {
    window.alert("you clicked the banner");
  }

  return (
    <>
      <BannerView
        color={author.color}
        onClick={handleClick}
        showShapes={showShapes}
      >
        {author.name}
      </BannerView>
    </>
  );
};

interface Props {
  showShapes: boolean;
}

const BannerView = styled.div<Props>`
  position: absolute;
  text-align: center;
  font-size: medium;
  top: ${(props) => (props.showShapes ? "1.2rem" : "0")};
  right: ${(props) => (props.showShapes ? "2.3rem" : "0")};
  padding: 0;
  z-index: 1;
  cursor: pointer;
  background-color: #ffffff;

  &:before {
    content: "";
    position: absolute;
    background-image: url(${require("../images/banner.png")});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: opacity(0.25);
  }
`;

export default Banner;
