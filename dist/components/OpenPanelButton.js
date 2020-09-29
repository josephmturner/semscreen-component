"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  z-index: 999;\n  ", "\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var OpenPanelButton = function OpenPanelButton(props) {
  return /*#__PURE__*/_react.default.createElement(StyledSvg, {
    width: "2em",
    height: "2em",
    viewBox: "0 0 16 16",
    fill: props.darkMode ? "#fff" : "#000",
    stroke: props.darkMode ? "white" : "black",
    strokeWidth: "1px",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: props.onClick,
    side: props.side
  }, props.side === "right" && /*#__PURE__*/_react.default.createElement("path", {
    "fill-rule": "evenodd",
    d: "M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"
  }), props.side === "bottom" && /*#__PURE__*/_react.default.createElement("path", {
    "fill-rule": "evenodd",
    d: "M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
  }));
};

var StyledSvg = _styledComponents.default.svg(_templateObject(), function (props) {
  return props.side === "right" && "\n  top: 0;\n  right: 0.5rem;\n  bottom: 0;\n  margin: auto 0;\n";
}, function (props) {
  return props.side === "bottom" && "\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0 auto;\n";
});

var _default = OpenPanelButton;
exports.default = _default;