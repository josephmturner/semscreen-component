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
    d: "M3.646 11.854a.5.5 0 0 0 .708 0L8 8.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708zM2.4 5.2c0 .22.18.4.4.4h10.4a.4.4 0 0 0 0-.8H2.8a.4.4 0 0 0-.4.4z"
  }));
};

var StyledSvg = _styledComponents.default.svg(_templateObject());

var _default = CloseButton;
exports.default = _default;