"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCursorPosition = void 0;

var _constants = require("./constants");

var setCursorPosition = function setCursorPosition(details) {
  return {
    type: _constants.Actions.setCursorPosition,
    params: {
      details: details
    }
  };
};

exports.setCursorPosition = setCursorPosition;