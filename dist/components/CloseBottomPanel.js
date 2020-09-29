"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  right: 0;\n  left: 0;\n  top: 0;\n  margin: 0 auto;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CloseButton = function CloseButton(props) {
  return /*#__PURE__*/_react.default.createElement(StyledSvg, {
    width: "2em",
    height: "2em",
    viewBox: "0 0 16 16",
    fill: props.darkMode ? "#fff" : "#000",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: props.onClick
  }, /*#__PURE__*/_react.default.createElement("path", {
    "fill-rule": "evenodd",
    d: "M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"
  }));
};

var StyledSvg = _styledComponents.default.svg(_templateObject());

var _default = CloseButton;
exports.default = _default;