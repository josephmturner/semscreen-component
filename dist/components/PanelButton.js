"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  border: 1px solid ", ";\n  ", "\n  ", "\n  ", "\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PanelButton = function PanelButton(props) {
  return /*#__PURE__*/_react.default.createElement(StyledSvg, {
    width: props.side === "right" ? "1em" : "2em",
    height: props.side === "bottom" ? "1em" : "2em",
    viewBox: "0 0 16 16",
    preserveAspectRatio: "none",
    fill: props.darkMode ? "white" : "black",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: props.onClick,
    side: props.side,
    openClose: props.openClose,
    darkMode: props.darkMode
  }, props.side === "right" && props.openClose === "open" && /*#__PURE__*/_react.default.createElement("path", {
    d: "M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"
  }), props.side === "right" && props.openClose === "close" && /*#__PURE__*/_react.default.createElement("path", {
    d: "M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"
  }), props.side === "bottom" && props.openClose === "open" && /*#__PURE__*/_react.default.createElement("path", {
    d: "M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
  }), props.side === "bottom" && props.openClose === "close" && /*#__PURE__*/_react.default.createElement("path", {
    d: "M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"
  }));
};

var StyledSvg = _styledComponents.default.svg(_templateObject(), function (props) {
  return props.darkMode ? "white" : "black";
}, function (props) {
  return props.side === "right" && props.openClose === "open" && "\n  top: 0;\n  right: 0;\n  bottom: 0;\n  margin: auto 0;\n    border-right: none;\n    border-radius: 10px 0 0 10px;\n";
}, function (props) {
  return props.side === "right" && props.openClose === "close" && "\n  top: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto 0;\n    border-left: none;\n    border-radius: 0 10px 10px 0;\n";
}, function (props) {
  return props.side === "bottom" && props.openClose === "open" && "\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0 auto;\n    border-bottom: none;\n    border-radius: 10px 10px 0 0;\n";
}, function (props) {
  return props.side === "bottom" && props.openClose === "close" && "\n  right: 0;\n  left: 0;\n  top: 0;\n  margin: 0 auto;\n    border-top: none;\n    border-radius: 0 0 10px 10px;\n";
});

var _default = PanelButton;
exports.default = _default;