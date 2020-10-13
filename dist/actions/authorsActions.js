"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAuthors = void 0;

var _constants = require("./constants");

var setAuthors = function setAuthors(params) {
  return {
    type: _constants.Actions.setAuthors,
    params: params
  };
};

exports.setAuthors = setAuthors;