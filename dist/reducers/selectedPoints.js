"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectedPointsReducer = exports.initialSelectedPointsState = void 0;

var _constants = require("../actions/constants");

var initialSelectedPointsState = {
  pointIds: []
};
exports.initialSelectedPointsState = initialSelectedPointsState;

var selectedPointsReducer = function selectedPointsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialSelectedPointsState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var appState = arguments.length > 2 ? arguments[2] : undefined;
  var newState = state;

  switch (action.type) {
    case _constants.Actions.setSelectedPoints:
      newState = handleSetSelectedPoints(state, action);
      break;

    case _constants.Actions.togglePoint:
      newState = handleTogglePoint(state, action);
      break;
  }

  return newState;
};

exports.selectedPointsReducer = selectedPointsReducer;

function handleSetSelectedPoints(state, action) {
  return {
    pointIds: action.params.pointIds
  };
}

function handleTogglePoint(state, action) {
  console.log('handling toggle point');
  var newPointIds = state.pointIds.filter(function (pointId) {
    return pointId !== action.params.pointId;
  });

  if (newPointIds.length === state.pointIds.length) {
    newPointIds.push(action.params.pointId);
  }

  return {
    pointIds: newPointIds
  };
}