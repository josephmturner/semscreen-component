"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDnd = require("react-dnd");

var _reactDndHtml5Backend = require("react-dnd-html5-backend");

var _animateCssGrid = require("animate-css-grid");

var _uuid = require("uuid");

var _randomcolor = _interopRequireDefault(require("randomcolor"));

var _Region = _interopRequireDefault(require("./Region"));

var _MeritsRegion = _interopRequireDefault(require("./MeritsRegion"));

var _FocusRegion = _interopRequireDefault(require("./FocusRegion"));

var _Banner = _interopRequireDefault(require("./Banner"));

var _StyledSemanticScreen = _interopRequireDefault(require("./StyledSemanticScreen"));

var _reactRedux = require("react-redux");

var _editingPointActions = require("../actions/editingPointActions");

var _messageActions = require("../actions/messageActions");

var _expandedRegionActions = require("../actions/expandedRegionActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
var SemanticScreen = function SemanticScreen(props) {
  var message = props.message,
      expandedRegion = props.expandedRegion;
  var author = message.author || {
    name: "anonymous",
    authorId: (0, _uuid.v4)(),
    authorDate: new Date(),
    color: (0, _randomcolor.default)()
  };

  var createEmptyPoint = function createEmptyPoint(shape, index, focus) {
    props.pointCreate({
      point: {
        author: author,
        content: ""
      },
      shape: shape,
      index: index,
      focus: focus
    });
  };

  var createEmptyFocus = function createEmptyFocus(shape) {
    createEmptyPoint(shape, message.points[shape].length, true);
  };

  var deleteEmptyPoints = function deleteEmptyPoints() {
    props.pointsDelete({
      pointIds: Object.values(message.points).flat().filter(function (p) {
        return !p.content;
      }).map(function (p) {
        return p.pointId;
      })
    });
  };

  var handleRegionClick = function handleRegionClick(region, expand) {
    if (!expand && region === expandedRegion) {
      props.setExpandedRegion("");
      !props.readOnly && deleteEmptyPoints();
    } else if (expand && region !== expandedRegion) {
      props.setExpandedRegion(region);
      !props.readOnly && deleteEmptyPoints();
    }
  };

  var regions = ["facts", "merits", "people", "thoughts", "focus", "actions", "feelings", "needs", "topics"];
  var semanticScreenRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    semanticScreenRef.current && (0, _animateCssGrid.wrapGrid)(semanticScreenRef.current, {
      duration: 150,
      easing: "linear"
    });
  }, []);

  var isExpanded = function isExpanded(region) {
    return region === expandedRegion ? "expanded" : expandedRegion === "" ? "balanced" : "minimized";
  };

  return /*#__PURE__*/_react.default.createElement(_reactDnd.DndProvider, {
    backend: _reactDndHtml5Backend.HTML5Backend
  }, /*#__PURE__*/_react.default.createElement(_StyledSemanticScreen.default, {
    expandedRegion: expandedRegion,
    ref: semanticScreenRef,
    darkMode: props.darkMode
  }, /*#__PURE__*/_react.default.createElement(_Banner.default, {
    text: author.name,
    color: author.color,
    placement: {
      top: "0",
      right: "0"
    },
    darkMode: props.darkMode
  }), regions.map(function (region) {
    if (region === "merits") {
      return /*#__PURE__*/_react.default.createElement(_MeritsRegion.default, {
        region: region,
        isExpanded: isExpanded(region),
        onRegionClick: handleRegionClick,
        key: region
      });
    }

    if (region === "focus") {
      return /*#__PURE__*/_react.default.createElement(_FocusRegion.default, {
        region: region,
        isExpanded: isExpanded(region),
        readOnly: props.readOnly,
        author: author,
        point: message.focus ? Object.values(message.points).flat().find(function (p) {
          return message.focus && p.pointId === message.focus.pointId;
        }) : undefined,
        shape: message.focus ? message.focus.shape : undefined,
        index: message.focus ? message.points[message.focus.shape].findIndex(function (p) {
          return message.focus && p.pointId === message.focus.pointId;
        }) : undefined,
        isMainPoint: message.focus && message.main === message.focus.pointId ? true : false,
        createEmptyFocus: createEmptyFocus,
        onRegionClick: handleRegionClick,
        key: region,
        darkMode: props.darkMode
      });
    } else {
      return /*#__PURE__*/_react.default.createElement(_Region.default, {
        region: region,
        isExpanded: isExpanded(region),
        readOnly: props.readOnly,
        author: author,
        points: message.points[region],
        focusPointId: message.focus && message.focus.pointId,
        mainPointId: message.main,
        createEmptyPoint: createEmptyPoint,
        onRegionClick: handleRegionClick,
        key: region,
        darkMode: props.darkMode
      });
    }
  })));
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    message: state.message,
    expandedRegion: state.expandedRegion.region
  };
};

var mapDispatchToProps = {
  pointCreate: _messageActions.pointCreate,
  pointsDelete: _messageActions.pointsDelete,
  setEditingPoint: _editingPointActions.setEditingPoint,
  setExpandedRegion: _expandedRegionActions.setExpandedRegion
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SemanticScreen);

exports.default = _default;