"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointsReducer = exports.initialPointsState = void 0;

var _constants = require("../actions/constants");

var _immer = _interopRequireDefault(require("immer"));

var _getters = require("../dataModels/getters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialPointsState = {
  byId: {}
};
exports.initialPointsState = initialPointsState;

var pointsReducer = function pointsReducer(state, action, appState) {
  var newState = state;

  switch (action.type) {
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

    case _constants.Actions.combinePoints:
      newState = handleCombinePoints(state, action, appState);
      break;

    case _constants.Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(state, action);
      break;

    case _constants.Actions.setFocus:
      newState = handleSetFocus(state, action);
      break;
  }

  return newState;
};

exports.pointsReducer = pointsReducer;

function handlePointCreate(state, action) {
  return (0, _immer.default)(state, function (draft) {
    draft.byId[action.params.newPointId] = _objectSpread(_objectSpread({}, action.params.point), {}, {
      _id: action.params.newPointId,
      pointDate: new Date()
    });
  });
}

function handlePointUpdate(state, action) {
  return (0, _immer.default)(state, function (draft) {
    draft.byId[action.params.point._id] = action.params.point;
  });
}

function handlePointMove(state, action) {
  if ((0, _getters.getPointById)(action.params.pointId, state).shape === action.params.newShape) return state;
  return (0, _immer.default)(state, function (draft) {
    draft.byId[action.params.pointId] = _objectSpread(_objectSpread({}, state.byId[action.params.pointId]), {}, {
      shape: action.params.newShape
    });
  });
}

function handlePointsDelete(state, action) {
  return (0, _immer.default)(state, function (draft) {
    action.params.pointIds.forEach(function (id) {
      return delete draft.byId[id];
    });
  });
} //TODO: reuse withinBounds and isQuoted logic in src/reducers/message
//Is it good form to access appState in src/actions/pointsActions?
//note: in src/reducers/message, state must be replaced with
//appState.points (and a similar change in this file)


function handleCombinePoints(state, action, appState) {
  var withinBounds = function withinBounds(index) {
    return index >= 0 && index < appState.message.shapes[action.params.shape].length;
  };

  var isQuoted = function isQuoted(index) {
    var pointId = appState.message.shapes[action.params.shape][index];
    return !!(0, _getters.getReferencedPointId)(pointId, state);
  }; // Don't attempt to combine a point with the point below it if no point
  // exists below it.


  if (!withinBounds(action.params.keepIndex) || !withinBounds(action.params.deleteIndex)) {
    return state;
  } // Don't combine points with quoted points:


  if (isQuoted(action.params.keepIndex) || isQuoted(action.params.deleteIndex)) {
    return state;
  }

  var pointIdToKeep = appState.message.shapes[action.params.shape][action.params.keepIndex];
  var pointIdToDelete = appState.message.shapes[action.params.shape][action.params.deleteIndex];
  var newContent = action.params.keepIndex < action.params.deleteIndex ? (0, _getters.getPointById)(pointIdToKeep, state).content + (0, _getters.getPointById)(pointIdToDelete, state).content : (0, _getters.getPointById)(pointIdToDelete, state).content + (0, _getters.getPointById)(pointIdToKeep, state).content;
  return (0, _immer.default)(state, function (draft) {
    delete draft.byId[pointIdToDelete];
    (0, _getters.getPointById)(pointIdToKeep, draft).content = newContent;
  });
}

function handleSplitIntoTwoPoints(state, action) {
  var topContent = (0, _getters.getPointById)(action.params.pointId, state).content.slice(0, action.params.sliceIndex);
  var bottomContent = (0, _getters.getPointById)(action.params.pointId, state).content.slice(action.params.sliceIndex);
  return (0, _immer.default)(state, function (draft) {
    (0, _getters.getPointById)(action.params.pointId, draft).content = topContent;
    draft.byId[action.params.newPointId] = {
      content: bottomContent,
      _id: action.params.newPointId,
      shape: (0, _getters.getPointById)(action.params.pointId, draft).shape,
      pointDate: new Date()
    };
  });
}

function handleSetFocus(state, action) {
  return (0, _immer.default)(state, function (draft) {
    //Ensures that points retain their original shape when set to
    //focus even if they've been dragged through another region
    (0, _getters.getPointById)(action.params.pointId, draft).shape = action.params.originalShape;
  });
}