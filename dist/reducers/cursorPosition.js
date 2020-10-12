"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cursorPositionReducer = exports.initialCursorPositionState = void 0;

var _getters = require("../dataModels/getters");

var _constants = require("../actions/constants");

var initialCursorPositionState = {};
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
  var pointId = action.params.pointId;
  var point = (0, _getters.getPointById)(pointId, appState.points);
  var shape = point.shape;
  var pointIds = appState.message.shapes[shape];
  var index = pointIds.findIndex(function (id) {
    return id === pointId;
  });
  var prevPointId = pointIds[index - 1];
  var prevPoint = (0, _getters.getPointById)(prevPointId, appState.points);
  var nextPointId = pointIds[index + 1];

  if (action.params.moveTo === "beginningOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        contentIndex: 0
      }
    };
  } else if (action.params.moveTo === "endOfPriorPoint") {
    newState = {
      details: {
        pointId: prevPointId,
        contentIndex: prevPoint.content.length
      }
    };
  } else if (action.params.moveTo === "beginningOfNextPoint") {
    if (index !== pointIds.length - 1) {
      newState = {
        details: {
          pointId: nextPointId,
          contentIndex: 0
        }
      };
    }
  } else {
    throw new Error("Unknown moveTo param: ".concat(action.params.moveTo));
  }

  return newState;
}

function handleClearCursorPosition(state, action) {
  return {};
}

function handleCombinePoints(state, action, appState) {
  var smallerIndex = Math.min(action.params.keepIndex, action.params.deleteIndex);
  var prevPointId = appState.message.shapes[action.params.shape][smallerIndex];
  var prevPoint = (0, _getters.getPointById)(prevPointId, appState.points);
  var newCursorPosition = {
    pointId: appState.message.shapes[action.params.shape][action.params.keepIndex],
    contentIndex: prevPoint.content.length
  };
  return {
    details: newCursorPosition
  };
}

function handleSplitIntoTwoPoints(state, action, appState) {
  return {
    details: {
      pointId: action.params.newPointId,
      contentIndex: 0
    }
  };
}