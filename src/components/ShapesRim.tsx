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

const ShapesRim = (props: { showShapes: boolean }) => {
  if (!props.showShapes) {
    return null;
  }

  return (
    <>
      <img
        className="Shape"
        id="FactsShape"
        alt=""
        src={require("../images/facts.svg")}
      />
      <img
        className="Shape"
        id="MeritsShape"
        alt=""
        src={require("../images/merits.svg")}
      />
      <img
        className="Shape"
        id="PeopleShape"
        alt=""
        src={require("../images/people.svg")}
      />
      <img
        className="Shape"
        id="ThoughtsShape"
        alt=""
        src={require("../images/thoughts.svg")}
      />
      <img
        className="Shape"
        id="ActionsShape"
        alt=""
        src={require("../images/actions.svg")}
      />
      <img
        className="Shape"
        id="FeelingsShape"
        alt=""
        src={require("../images/feelings.svg")}
      />
      <img
        className="Shape"
        id="NeedsShape"
        alt=""
        src={require("../images/needs.svg")}
      />
      <img
        className="Shape"
        id="TopicsShape"
        alt=""
        src={require("../images/topics.svg")}
      />
    </>
  );
};

export default ShapesRim;
