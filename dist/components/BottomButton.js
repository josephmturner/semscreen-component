"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0 auto;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var BottomButton = function BottomButton(props) {
  return /*#__PURE__*/_react.default.createElement(StyledSvg, {
    width: "2em",
    height: "2em",
    viewBox: "0 0 16 16",
    fill: props.darkMode ? "#fff" : "#000",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: props.onClick
  }, /*#__PURE__*/_react.default.createElement("path", {
    "fill-rule": "evenodd",
    d: "M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
  }));
};

var StyledSvg = _styledComponents.default.svg(_templateObject());

var _default = BottomButton;
exports.default = _default;