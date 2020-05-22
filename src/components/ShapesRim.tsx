import React from 'react';

const ShapesRim = (props: {showShapes: boolean}) => {
  if (!props.showShapes) {
    return null;
  }

  return (
   <>
    <img className="Shape" id="FactsShape" alt="" src={require("../images/Facts.svg")} />
    <img className="Shape" id="MeritsShape" alt="" src={require("../images/Merits.svg")} />
    <img className="Shape" id="PeopleShape" alt="" src={require("../images/People.svg")} />
    <img className="Shape" id="ThoughtsShape" alt="" src={require("../images/Thoughts.svg")} />
    <img className="Shape" id="ActionsShape" alt="" src={require("../images/Actions.svg")} />
    <img className="Shape" id="FeelingsShape" alt="" src={require("../images/Feelings.svg")} />
    <img className="Shape" id="NeedsShape" alt="" src={require("../images/Needs.svg")} />
    <img className="Shape" id="TopicsShape" alt="" src={require("../images/Topics.svg")} />
   </>
    )
}

export default ShapesRim;
