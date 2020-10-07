"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hidePanel = exports.showPanel = void 0;

var _constants = require("./constants");

var showPanel = function showPanel(params) {
  return {
    type: _constants.Actions.showPanel,
    params: params
  };
};

exports.showPanel = showPanel;

var hidePanel = function hidePanel(params) {
  return {
    type: _constants.Actions.hidePanel,
    params: params
  };
};

exports.hidePanel = hidePanel;