"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandedRegionReducer = exports.initialExpandedRegionState = void 0;

var _constants = require("../actions/constants");

var initialExpandedRegionState = {
  region: ""
};
exports.initialExpandedRegionState = initialExpandedRegionState;

var expandedRegionReducer = function expandedRegionReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialExpandedRegionState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var appState = arguments.length > 2 ? arguments[2] : undefined;
  var newState = state;

  switch (action.type) {
    case _constants.Actions.setExpandedRegion:
      newState = handleSetExpandedRegion(state, action);
      break;
  }

  return newState;
};

exports.expandedRegionReducer = expandedRegionReducer;

function handleSetExpandedRegion(state, action) {
  var newState = state;

  if (state.region === action.params.region) {
    newState = {
      region: ""
    };
  } else {
    newState = {
      region: action.params.region
    };
  }

  return newState;
}