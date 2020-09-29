"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  ", "\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ClosePanelButton = function ClosePanelButton(props) {
  return /*#__PURE__*/_react.default.createElement(StyledSvg, {
    width: "2em",
    height: "2em",
    viewBox: "0 0 16 16",
    stroke: props.darkMode ? "#7e7e7e" : "#696969",
    strokeWidth: "1px",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: props.onClick,
    side: props.side
  }, props.side === "right" && /*#__PURE__*/_react.default.createElement("path", {
    "fill-rule": "evenodd",
    d: "M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"
  }), props.side === "bottom" && /*#__PURE__*/_react.default.createElement("path", {
    "fill-rule": "evenodd",
    d: "M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"
  }));
};

var StyledSvg = _styledComponents.default.svg(_templateObject(), function (props) {
  return props.side === "right" && "\n  top: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto 0;\n  ";
}, function (props) {
  return props.side === "bottom" && "\n  right: 0;\n  left: 0;\n  top: 0;\n  margin: 0 auto;\n  ";
});

var _default = ClosePanelButton;
exports.default = _default;