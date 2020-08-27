"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editingPointReducer = exports.initialEditingPointState = void 0;

var _constants = require("../actions/constants");

var initialEditingPointState = {
  editingPointId: ""
};
exports.initialEditingPointState = initialEditingPointState;

var editingPointReducer = function editingPointReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialEditingPointState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var appState = arguments.length > 2 ? arguments[2] : undefined;
  var newState = state;

  switch (action.type) {
    case _constants.Actions.setEditingPoint:
      newState = handleSetEditingPoint(state, action);
      break;

    case _constants.Actions.pointCreate:
      newState = handlePointCreate(state, action);
      break;
  }

  return newState;
};

exports.editingPointReducer = editingPointReducer;

function handleSetEditingPoint(state, action) {
  return {
    editingPointId: action.params.pointId
  };
}

function handlePointCreate(state, action) {
  return {
    editingPointId: action.params.newPointId
  };
}