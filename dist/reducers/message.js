"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageReducer = exports.initialMessageState = void 0;

var _constants = require("../actions/constants");

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _uuid = require("uuid");

var _randomcolor = _interopRequireDefault(require("randomcolor"));

var _dataModels = require("../dataModels");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialMessageState = {
  _id: (0, _uuid.v4)(),
  author: {
    name: "anonymous",
    color: (0, _randomcolor.default)()
  },
  points: {
    facts: [],
    thoughts: [],
    feelings: [],
    needs: [],
    topics: [],
    actions: [],
    people: []
  },
  createdAt: new Date()
};
exports.initialMessageState = initialMessageState;

var messageReducer = function messageReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialMessageState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var appState = arguments.length > 2 ? arguments[2] : undefined;
  var newState = state;

  switch (action.type) {
    case _constants.Actions.setMessage:
      newState = setMessage(state, action);
      break;

    case _constants.Actions.pointCreate:
      newState = handlePointCreate(state, action);
      break;

    case _constants.Actions.pointUpdate:
      newState = handlePointUpdate(state, action);
      break;

    case _constants.Actions.pointMove:
      newState = handlePointMove(state, action);
      break;

    case _constants.Actions.pointsDelete:
      newState = handlePointsDelete(state, action);
      break;

    case _constants.Actions.setFocus:
      newState = handleSetFocus(state, action);
      break;

    case _constants.Actions.setMainPoint:
      newState = handleSetMainPoint(state, action);
      break;

    case _constants.Actions.combinePoints:
      newState = handleCombinePoints(state, action);
      break;

    case _constants.Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(state, action);
      break;
  }

  return newState;
};

exports.messageReducer = messageReducer;

function setMessage(state, action) {
  return action.params.message;
}

function handlePointCreate(state, action) {
  var newPoints = state.points[action.params.shape].slice();
  newPoints.splice(action.params.index, 0, _objectSpread(_objectSpread({}, action.params.point), {}, {
    _id: action.params.newPointId,
    pointDate: new Date()
  }));
  return action.params.focus ? _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, _defineProperty({}, action.params.shape, newPoints)),
    focus: {
      _id: action.params.newPointId,
      shape: action.params.shape
    }
  }) : _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, _defineProperty({}, action.params.shape, newPoints))
  });
}

function handlePointUpdate(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, _defineProperty({}, action.params.shape, state.points[action.params.shape].map(function (p) {
      if (p._id === action.params.point._id) {
        return action.params.point;
      }

      return p;
    })))
  });
}

function handlePointMove(state, action) {
  var _objectSpread6;

  var pointWithNewShape = state.points[action.params.oldShape].find(function (p) {
    return p._id === action.params.pointId;
  });
  var newFocus = state.focus;

  if (state.focus && action.params.pointId === state.focus._id) {
    newFocus = undefined;
  }

  return action.params.oldShape === action.params.newShape ? _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, _defineProperty({}, action.params.oldShape, (0, _immutabilityHelper.default)(state.points[action.params.oldShape], {
      $splice: [[action.params.oldIndex, 1], [action.params.newIndex, 0, pointWithNewShape]]
    }))),
    focus: newFocus
  }) : _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, (_objectSpread6 = {}, _defineProperty(_objectSpread6, action.params.oldShape, (0, _immutabilityHelper.default)(state.points[action.params.oldShape], {
      $splice: [[action.params.oldIndex, 1]]
    })), _defineProperty(_objectSpread6, action.params.newShape, (0, _immutabilityHelper.default)(state.points[action.params.newShape], {
      $splice: [[action.params.newIndex, 0, pointWithNewShape]]
    })), _objectSpread6)),
    focus: newFocus
  });
}

function handlePointsDelete(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    points: _dataModels.allPointShapes.reduce(function (obj, pointShape) {
      obj[pointShape] = state.points[pointShape].filter(function (p) {
        return !action.params.pointIds.includes(p._id);
      });
      return obj;
    }, state.points)
  });
}

function handleSetFocus(state, action) {
  var intermediateState = handlePointMove(state, action);
  return _objectSpread(_objectSpread({}, intermediateState), {}, {
    focus: {
      _id: action.params.pointId,
      shape: action.params.newShape
    }
  });
}

function handleSetMainPoint(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    main: action.params.pointId
  });
}

function handleCombinePoints(state, action) {
  // Don't attempt to combine a point with the point below it if no point
  // exists below it.
  if (action.params.aboveOrBelow === "below" && action.params.index === state.points[action.params.shape].length - 1) {
    return state;
  } // Don't combine points with quoted points:


  if (action.params.aboveOrBelow === "below" && state.points[action.params.shape][action.params.index + 1].quotedAuthor || action.params.aboveOrBelow === "above" && state.points[action.params.shape][action.params.index - 1].quotedAuthor) {
    return state;
  }

  var prevPoint = state.points[action.params.shape][action.params.index - 1];
  var currentPoint = state.points[action.params.shape][action.params.index];
  var nextPoint = state.points[action.params.shape][action.params.index + 1];
  var combinedPoints = state.points[action.params.shape].slice();
  action.params.aboveOrBelow === "above" && combinedPoints.splice(action.params.index - 1, 2, _objectSpread(_objectSpread({}, prevPoint), {}, {
    content: prevPoint.content + currentPoint.content
  }));
  action.params.aboveOrBelow === "below" && combinedPoints.splice(action.params.index, 2, _objectSpread(_objectSpread({}, currentPoint), {}, {
    content: currentPoint.content + nextPoint.content
  }));
  return _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, _defineProperty({}, action.params.shape, combinedPoints))
  });
}

function handleSplitIntoTwoPoints(state, action) {
  var splitPoints = state.points[action.params.shape].slice();
  splitPoints.splice(action.params.index, 1, _objectSpread(_objectSpread({}, state.points[action.params.shape][action.params.index]), {}, {
    content: action.params.topPoint.content
  }), _objectSpread(_objectSpread({}, action.params.bottomPoint), {}, {
    _id: action.params.newPointId,
    pointDate: new Date()
  }));
  return _objectSpread(_objectSpread({}, state), {}, {
    points: _objectSpread(_objectSpread({}, state.points), {}, _defineProperty({}, action.params.shape, splitPoints))
  });
}