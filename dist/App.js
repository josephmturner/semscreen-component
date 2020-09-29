"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _SemanticScreen = _interopRequireDefault(require("./components/SemanticScreen"));

var _OpenPanelButton = _interopRequireDefault(require("./components/OpenPanelButton"));

var _ClosePanelButton = _interopRequireDefault(require("./components/ClosePanelButton"));

var _ParkingSpace = _interopRequireDefault(require("./components/ParkingSpace"));

var _usePanel3 = _interopRequireDefault(require("./hooks/usePanel"));

var _initialState = require("./constants/initialState");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  height: 4rem;\n  width: 100%;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 100%;\n  width: 16rem;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  height: ", ";\n  width: ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 100%;\n\n  ", "\n\n  *>div {\n    scrollbar-color: var(--thumbBG) var(--scrollbarBG);\n    scrollbar-width: thin;\n  }\n  * > div ::-webkit-scrollbar {\n    width: 11px;\n  }\n  * > div ::-webkit-scrollbar-thumb {\n    background-color: var(--thumbBG);\n    border: 3px solid var(--scrollbarBG);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var App = function App() {
  var readOnly = false;
  var darkMode = true;

  var _useState = (0, _react.useState)(_initialState.messages[0]),
      _useState2 = _slicedToArray(_useState, 2),
      message = _useState2[0],
      setMessage = _useState2[1];

  var onChangeMessage = function onChangeMessage(message) {
    setMessage(message);
  };

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedPointIds = _useState4[0],
      setSelectedPointIds = _useState4[1];

  var onChangeSelectedPointIds = function onChangeSelectedPointIds(selectedPointIds) {
    setSelectedPointIds(selectedPointIds);
  };

  var _usePanel = (0, _usePanel3.default)(),
      _usePanel2 = _slicedToArray(_usePanel, 2),
      panelState = _usePanel2[0],
      panelDispatch = _usePanel2[1];

  return /*#__PURE__*/_react.default.createElement(AppStyles, {
    darkMode: darkMode
  }, /*#__PURE__*/_react.default.createElement(SemscreenPanel, {
    right: panelState.right,
    bottom: panelState.bottom
  }, /*#__PURE__*/_react.default.createElement(_SemanticScreen.default, {
    message: message,
    onChangeMessage: onChangeMessage,
    selectedPointIds: selectedPointIds,
    onChangeSelectedPointIds: onChangeSelectedPointIds,
    readOnly: readOnly,
    darkMode: darkMode
  })), !panelState.right && /*#__PURE__*/_react.default.createElement(_OpenPanelButton.default, {
    side: "right",
    onClick: function onClick() {
      panelDispatch({
        panel: "right",
        show: true
      });
    },
    darkMode: darkMode
  }), panelState.right && /*#__PURE__*/_react.default.createElement(RightPanel, null, /*#__PURE__*/_react.default.createElement(_ParkingSpace.default, {
    darkMode: darkMode
  }), /*#__PURE__*/_react.default.createElement(_ClosePanelButton.default, {
    side: "right",
    onClick: function onClick() {
      return panelDispatch({
        panel: "right",
        show: false
      });
    },
    darkMode: darkMode
  })), !panelState.bottom && /*#__PURE__*/_react.default.createElement(_OpenPanelButton.default, {
    side: "bottom",
    onClick: function onClick() {
      panelDispatch({
        panel: "bottom",
        show: true
      });
    },
    darkMode: darkMode
  }), panelState.bottom && /*#__PURE__*/_react.default.createElement(BottomPanel, null, /*#__PURE__*/_react.default.createElement(_ParkingSpace.default, {
    darkMode: darkMode
  }), /*#__PURE__*/_react.default.createElement(_ClosePanelButton.default, {
    side: "bottom",
    onClick: function onClick() {
      return panelDispatch({
        panel: "bottom",
        show: false
      });
    },
    darkMode: darkMode
  })));
};

var AppStyles = _styledComponents.default.div(_templateObject(), function (props) {
  return props.darkMode ? "\n    --thumbBG: #7e7e7e;\n    --scrollbarBG: black;\n  " : "\n    --thumbBG: #696969;\n    --scrollbarBG: white;\n  ";
});

var SemscreenPanel = _styledComponents.default.div(_templateObject2(), function (props) {
  return props.bottom ? "calc(100% - 4rem)" : "100%";
}, function (props) {
  return props.right ? "calc(100% - 16rem)" : "100%";
});

var RightPanel = _styledComponents.default.div(_templateObject3());

var BottomPanel = _styledComponents.default.div(_templateObject4());

var _default = App;
exports.default = _default;