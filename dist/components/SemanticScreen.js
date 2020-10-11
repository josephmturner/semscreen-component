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

var _ShapeRegion = _interopRequireDefault(require("./ShapeRegion"));

var _MeritsRegion = _interopRequireDefault(require("./MeritsRegion"));

var _FocusRegion = _interopRequireDefault(require("./FocusRegion"));

var _Banner = _interopRequireDefault(require("./Banner"));

var _StyledSemanticScreen = _interopRequireDefault(require("./StyledSemanticScreen"));

var _reactRedux = require("react-redux");

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
  var author = props.author,
      expandedRegion = props.expandedRegion; // TODO: move regions to constants and rename allRegions

  var regions = ["facts", "merits", "people", "thoughts", "focus", "actions", "feelings", "needs", "topics"];
  var semanticScreenRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    semanticScreenRef.current && (0, _animateCssGrid.wrapGrid)(semanticScreenRef.current, {
      duration: 150,
      easing: "linear"
    });
  }, []); //TODO: move isExpanded logic inside mapStateToProps in each region?

  var isExpanded = function isExpanded(region) {
    return region === expandedRegion ? "expanded" : expandedRegion === "" ? "balanced" : "minimized";
  };

  return /*#__PURE__*/_react.default.createElement(_reactDnd.DndProvider, {
    backend: _reactDndHtml5Backend.HTML5Backend
  }, /*#__PURE__*/_react.default.createElement(_StyledSemanticScreen.default, {
    expandedRegion: expandedRegion,
    ref: semanticScreenRef,
    darkMode: props.darkMode
  }, props.readOnly && /*#__PURE__*/_react.default.createElement(_Banner.default, {
    text: author.name,
    color: author.color,
    placement: {
      top: "0",
      right: "0"
    },
    darkMode: props.darkMode
  }), regions.map(function (region) {
    //TODO: short-circuit evaluation instead of if statements?
    if (region === "merits") {
      return /*#__PURE__*/_react.default.createElement(_MeritsRegion.default, {
        region: region,
        isExpanded: isExpanded(region),
        key: region
      });
    }

    if (region === "focus") {
      return /*#__PURE__*/_react.default.createElement(_FocusRegion.default, {
        region: region,
        isExpanded: isExpanded(region),
        readOnly: props.readOnly,
        key: region,
        darkMode: props.darkMode
      });
    } else {
      return /*#__PURE__*/_react.default.createElement(_ShapeRegion.default, {
        shape: region,
        isExpanded: isExpanded(region),
        readOnly: props.readOnly,
        key: region,
        darkMode: props.darkMode
      });
    }
  })));
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    author: state.message.author,
    expandedRegion: state.expandedRegion.region
  };
};

var mapDispatchToProps = {};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SemanticScreen);

exports.default = _default;