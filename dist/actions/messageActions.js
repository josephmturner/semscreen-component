"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitIntoTwoPoints = exports.setMainPoint = exports.setFocus = void 0;

var _constants = require("./constants");

var setFocus = function setFocus(params) {
  return {
    type: _constants.Actions.setFocus,
    params: params
  };
};

exports.setFocus = setFocus;

var setMainPoint = function setMainPoint(params) {
  return {
    type: _constants.Actions.setMainPoint,
    params: params
  };
};

exports.setMainPoint = setMainPoint;

var splitIntoTwoPoints = function splitIntoTwoPoints(params) {
  return {
    type: _constants.Actions.splitIntoTwoPoints,
    params: params
  };
};

exports.splitIntoTwoPoints = splitIntoTwoPoints;