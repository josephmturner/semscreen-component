"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearCursorPosition = exports.setCursorPosition = void 0;

var _constants = require("./constants");

var setCursorPosition = function setCursorPosition(params) {
  return {
    type: _constants.Actions.setCursorPosition,
    params: params
  };
};

exports.setCursorPosition = setCursorPosition;

var clearCursorPosition = function clearCursorPosition() {
  return {
    type: _constants.Actions.clearCursorPosition,
    params: {}
  };
};

exports.clearCursorPosition = clearCursorPosition;