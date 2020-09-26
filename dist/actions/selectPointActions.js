"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.togglePoint = exports.setSelectedPoints = void 0;

var _constants = require("./constants");

var setSelectedPoints = function setSelectedPoints(params) {
  return {
    type: _constants.Actions.setSelectedPoints,
    params: params
  };
};

exports.setSelectedPoints = setSelectedPoints;

var togglePoint = function togglePoint(params) {
  return {
    type: _constants.Actions.togglePoint,
    params: params
  };
};

exports.togglePoint = togglePoint;