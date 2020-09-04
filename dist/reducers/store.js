"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createAppStore;

var _redux = require("redux");

var _developmentOnly = require("redux-devtools-extension/developmentOnly");

var _editingPoint = require("./editingPoint");

var _cursorPosition = require("./cursorPosition");

var _message = require("./message");

var _expandedRegion = require("./expandedRegion");

function createAppStore() {
  var initialAppState = {
    editingPoint: _editingPoint.initialEditingPointState,
    cursorPosition: _cursorPosition.initialCursorPositionState,
    message: _message.initialMessageState,
    expandedRegion: _expandedRegion.initialExpandedRegionState
  };

  var appReducer = function appReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialAppState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var newState = {
      editingPoint: (0, _editingPoint.editingPointReducer)(state.editingPoint, action, state),
      cursorPosition: (0, _cursorPosition.cursorPositionReducer)(state.cursorPosition, action, state),
      message: (0, _message.messageReducer)(state.message, action, state),
      expandedRegion: (0, _expandedRegion.expandedRegionReducer)(state.expandedRegion, action, state)
    };
    return newState;
  };

  return (0, _redux.createStore)(appReducer, (0, _developmentOnly.composeWithDevTools)());
}