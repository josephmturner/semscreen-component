"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  height: 100%;\n  width: 100%;\n  background-color: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ParkingSpace = function ParkingSpace(props) {
  return /*#__PURE__*/_react.default.createElement(StyledParkingSpace, {
    darkMode: props.darkMode
  });
};

var StyledParkingSpace = _styledComponents.default.div(_templateObject(), function (props) {
  return props.darkMode ? "#000" : "#fff";
});

var _default = ParkingSpace;
exports.default = _default;