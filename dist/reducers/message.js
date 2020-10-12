"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageReducer = exports.initialMessageState = void 0;

var _constants = require("../actions/constants");

var _immer = _interopRequireDefault(require("immer"));

var _randomcolor = _interopRequireDefault(require("randomcolor"));

var _uuid = require("uuid");

var _dataModels = require("../dataModels/dataModels");

var _getters = require("../dataModels/getters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialMessageState = {
  _id: (0, _uuid.v4)(),
  author: {
    name: "author0",
    color: (0, _randomcolor.default)()
  },
  shapes: {
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
    case _constants.Actions.pointCreate:
      newState = handlePointCreate(state, action);
      break;

    case _constants.Actions.pointMove:
      newState = handlePointMove(state, action, appState);
      break;

    case _constants.Actions.pointsDelete:
      newState = handlePointsDelete(state, action);
      break;

    case _constants.Actions.setFocus:
      newState = handleSetFocus(state, action, appState);
      break;

    case _constants.Actions.setMainPoint:
      newState = handleSetMainPoint(state, action);
      break;

    case _constants.Actions.combinePoints:
      newState = handleCombinePoints(state, action, appState);
      break;

    case _constants.Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(state, action, appState);
      break;
  }

  return newState;
}; //function setMessage(
//  state: MessageState,
//  action: Action<SetMessageParams>
//): MessageState {
//  return action.params.message;
//}


exports.messageReducer = messageReducer;

function handlePointCreate(state, action) {
  var shape = action.params.point.shape;
  return (0, _immer.default)(state, function (draft) {
    if (action.params.focus) {
      draft.focus = action.params.newPointId;
    } else if (typeof action.params.index === "number") {
      draft.shapes[shape].splice(action.params.index, 0, action.params.newPointId);
    }
  });
}

function handlePointMove(state, action, appState) {
  //TODO: oldShape also gets defined later in handleSetFocus. Can we
  //reuse it?
  var oldShape = (0, _getters.getPointById)(action.params.pointId, appState.points).shape;
  return (0, _immer.default)(state, function (draft) {
    //If point was the focus (lacks index)...
    if (typeof action.params.oldIndex !== "number") {
      draft.shapes[action.params.newShape].splice(action.params.newIndex, 0, action.params.pointId);
      delete draft.focus; //If point was already inside the region...
    } else if (oldShape === action.params.newShape) {
      draft.shapes[oldShape].splice(action.params.oldIndex, 1);
      draft.shapes[oldShape].splice(action.params.newIndex, 0, action.params.pointId);
    } else {
      draft.shapes[oldShape].splice(action.params.oldIndex, 1);
      draft.shapes[action.params.newShape].splice(action.params.newIndex, 0, action.params.pointId);
    }
  });
}

function handlePointsDelete(state, action) {
  return (0, _immer.default)(state, function (draft) {
    _dataModels.allPointShapes.forEach(function (shape) {
      draft.shapes[shape] = draft.shapes[shape].filter(function (id) {
        return !action.params.pointIds.includes(id);
      });
    });

    draft.focus && action.params.pointIds.includes(draft.focus) && delete draft.focus;
    draft.main && action.params.pointIds.includes(draft.main) && delete draft.main;
  });
}

function handleSetFocus(state, action, appState) {
  //newFocusShape refers to the current shape of the point.
  //Note that this may be different from its originalShape.
  var newFocusShape = (0, _getters.getPointById)(action.params.pointId, appState.points).shape;
  return (0, _immer.default)(state, function (draft) {
    draft.shapes[newFocusShape] = draft.shapes[newFocusShape].filter(function (id) {
      return id !== action.params.pointId;
    });

    if (draft.focus) {
      var oldFocusShape = (0, _getters.getPointById)(draft.focus, appState.points).shape;
      draft.shapes[oldFocusShape].push(draft.focus);
    }

    draft.focus = action.params.pointId;
  });
}

function handleSetMainPoint(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    main: action.params.pointId
  });
}

function handleCombinePoints(state, action, appState) {
  var withinBounds = function withinBounds(index) {
    return index >= 0 && index < state.shapes[action.params.shape].length;
  };

  var isQuoted = function isQuoted(index) {
    var pointId = appState.message.shapes[action.params.shape][index];
    return !!(0, _getters.getReferencedPointId)(pointId, appState.points);
  }; // Don't attempt to combine a point with the point below it if no point
  // exists below it.


  if (!withinBounds(action.params.keepIndex) || !withinBounds(action.params.deleteIndex)) {
    return state;
  } // Don't combine points with quoted points:


  if (isQuoted(action.params.keepIndex) || isQuoted(action.params.deleteIndex)) {
    return state;
  }

  var pointIdToDelete = state.shapes[action.params.shape][action.params.deleteIndex];
  return (0, _immer.default)(state, function (draft) {
    draft.shapes[action.params.shape] = draft.shapes[action.params.shape].filter(function (id) {
      return id !== pointIdToDelete;
    });
    draft.main === pointIdToDelete && delete draft.main;
  });
}

function handleSplitIntoTwoPoints(state, action, appState) {
  return (0, _immer.default)(state, function (draft) {
    var shape = (0, _getters.getPointById)(action.params.pointId, appState.points).shape;
    var splitPointIndex = draft.shapes[shape].findIndex(function (id) {
      return id === action.params.pointId;
    }) + 1;
    draft.shapes[shape].splice(splitPointIndex, 0, action.params.newPointId);
  });
}