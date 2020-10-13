"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorsReducer = exports.initialAuthorsState = void 0;

var _randomcolor = _interopRequireDefault(require("randomcolor"));

var _constants = require("../actions/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialAuthorsState = {
  byId: {
    author0: {
      _id: "author0",
      name: "anonymous",
      color: (0, _randomcolor.default)()
    }
  }
};
exports.initialAuthorsState = initialAuthorsState;

var authorsReducer = function authorsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialAuthorsState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var appState = arguments.length > 2 ? arguments[2] : undefined;
  var newState = state;

  switch (action.type) {
    case _constants.Actions.setAuthors:
      newState = handleSetAuthors(state, action);
      break;
  }

  return newState;
};

exports.authorsReducer = authorsReducer;

function handleSetAuthors(state, action) {
  return state;
}