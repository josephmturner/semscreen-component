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
      newState = handleSetCursorPosition(state, action, appState);
      break;

    case _constants.Actions.clearCursorPosition:
      newState = handleClearCursorPosition(state, action);
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

function handleSetCursorPosition(state, action, appState) {
  var newState = state;
  var _action$params = action.params,
      pointId = _action$params.pointId,
      index = _action$params.index;
  var point = appState.points.byId[pointId];
  var shape = point.shape;
  var pointIds = appState.message.shapes[shape];
  var prevPointId = pointIds[index - 1];
  var prevPoint = appState.points.byId[prevPointId];
  var nextPointId = pointIds[index + 1];

  if (action.params.moveTo === "beginningOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        index: 0,
        shape: shape
      }
    };
  } else if (action.params.moveTo === "endOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        index: prevPoint.content.length,
        shape: shape
      }
    };
  } else if (action.params.moveTo === "beginningOfNextPoint") {
    if (index !== pointIds.length - 1) {
      newState = {
        details: {
          pointId: nextPointId,
          index: 0,
          shape: shape
        }
      };
    }
  } else {
    throw new Error("Unknown moveTo param: ".concat(action.params.moveTo));
  }

  return newState;
}

function handleClearCursorPosition(state, action) {
  return {
    details: null
  };
}

function handleCombinePoints(state, action, appState) {
  var smallerIndex = Math.min(action.params.keepIndex, action.params.deleteIndex);
  var prevPointId = appState.message.shapes[action.params.shape][smallerIndex];
  var prevPoint = appState.points.byId[prevPointId];
  var newCursorPosition = {
    pointId: appState.message.shapes[action.params.shape][action.params.keepIndex],
    index: prevPoint.content.length,
    shape: action.params.shape
  };
  return {
    details: newCursorPosition
  };
}

function handleSplitIntoTwoPoints(state, action, appState) {
  var shape = appState.points.byId[action.params.pointId].shape;
  return {
    details: {
      pointId: action.params.newPointId,
      index: 0,
      shape: shape
    }
  };
}