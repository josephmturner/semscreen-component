"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _redux = require("redux");

var _developmentOnly = require("redux-devtools-extension/developmentOnly");

var _cursorPosition = require("./cursorPosition");

var _message = require("./message");

var _expandedRegion = require("./expandedRegion");

var _selectedPoints = require("./selectedPoints");

var _initialState = require("../constants/initialState");

// Set this to false if you don't want initial message data.
var populatedInitialMessageState = true ? _initialState.messages[0] : null;

function createAppStore() {
  var initialAppState = {
    cursorPosition: _cursorPosition.initialCursorPositionState,
    message: populatedInitialMessageState !== null && populatedInitialMessageState !== void 0 ? populatedInitialMessageState : _message.initialMessageState,
    expandedRegion: _expandedRegion.initialExpandedRegionState,
    selectedPoints: _selectedPoints.initialSelectedPointsState
  };

  var appReducer = function appReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialAppState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var newState = {
      cursorPosition: (0, _cursorPosition.cursorPositionReducer)(state.cursorPosition, action, state),
      message: (0, _message.messageReducer)(state.message, action, state),
      expandedRegion: (0, _expandedRegion.expandedRegionReducer)(state.expandedRegion, action, state),
      selectedPoints: (0, _selectedPoints.selectedPointsReducer)(state.selectedPoints, action, state)
    };
    return newState;
  };

  return (0, _redux.createStore)(appReducer, (0, _developmentOnly.composeWithDevTools)());
}

var store = createAppStore();
exports.store = store;