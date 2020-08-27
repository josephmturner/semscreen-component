"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEditingPoint = void 0;

var _constants = require("./constants");

var setEditingPoint = function setEditingPoint(pointId) {
  return {
    type: _constants.Actions.setEditingPoint,
    params: {
      pointId: pointId
    }
  };
};

exports.setEditingPoint = setEditingPoint;