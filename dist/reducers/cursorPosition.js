"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cursorPositionReducer = exports.initialCursorPositionState = void 0;

var _constants = require("../actions/constants");

var initialCursorPositionState = {
  details: null
};
exports.initialCursorPositionState = initialCursorPositionState;

var cursorPositionReducer = function cursorPositionReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCursorPositionState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var appState = arguments.length > 2 ? arguments[2] : undefined;
  var newState = state;

  switch (action.type) {
    case _constants.Actions.setCursorPosition:
      newState = handleSetCursorPosition(state, action);
      break;

    case _constants.Actions.combinePoints:
      newState = handleCombinePoints(state, action, appState);
      break;

    case _constants.Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(state, action, appState);
      break;
  }

  return newState;
};

exports.cursorPositionReducer = cursorPositionReducer;

function handleSetCursorPosition(state, action) {
  return {
    details: action.params.details
  };
}

function handleCombinePoints(state, action, appState) {
  var prevPoint = appState.message.points[action.params.shape][action.params.index - 1];
  var currentPoint = appState.message.points[action.params.shape][action.params.index];
  var newCursorPosition = action.params.aboveOrBelow === "above" ? {
    pointId: prevPoint.pointId,
    index: prevPoint.content.length
  } : {
    pointId: currentPoint.pointId,
    index: currentPoint.content.length
  };
  return {
    details: newCursorPosition
  };
}

function handleSplitIntoTwoPoints(state, action, appState) {
  return {
    details: {
      pointId: action.params.newPointId,
      index: 0
    }
  };
}