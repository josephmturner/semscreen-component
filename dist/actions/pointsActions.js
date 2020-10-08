"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitIntoTwoPoints = exports.combinePoints = exports.pointsDelete = exports.pointMove = exports.pointUpdate = exports.pointCreate = void 0;

var _constants = require("./constants");

var _uuid = require("uuid");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var pointCreate = function pointCreate(params) {
  var newPointId = (0, _uuid.v4)();
  return {
    type: _constants.Actions.pointCreate,
    params: _objectSpread(_objectSpread({}, params), {}, {
      newPointId: newPointId
    })
  };
};

exports.pointCreate = pointCreate;

var pointUpdate = function pointUpdate(params) {
  return {
    type: _constants.Actions.pointUpdate,
    params: params
  };
};

exports.pointUpdate = pointUpdate;

var pointMove = function pointMove(params) {
  return {
    type: _constants.Actions.pointMove,
    params: params
  };
};

exports.pointMove = pointMove;

var pointsDelete = function pointsDelete(params) {
  return {
    type: _constants.Actions.pointsDelete,
    params: params
  };
};

exports.pointsDelete = pointsDelete;

var combinePoints = function combinePoints(params) {
  return {
    type: _constants.Actions.combinePoints,
    params: params
  };
};

exports.combinePoints = combinePoints;

var splitIntoTwoPoints = function splitIntoTwoPoints(params) {
  var newPointId = (0, _uuid.v4)();
  return {
    type: _constants.Actions.splitIntoTwoPoints,
    params: _objectSpread(_objectSpread({}, params), {}, {
      newPointId: newPointId
    })
  };
};

exports.splitIntoTwoPoints = splitIntoTwoPoints;