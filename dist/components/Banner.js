"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  text-align: center;\n  font-size: medium;\n  top: ", ";\n  right: ", ";\n  padding: 0;\n  z-index: 1;\n  cursor: pointer;\n  background-color: #ffffff;\n\n  &:before {\n    content: \"\";\n    position: absolute;\n    background-image: url(", ");\n    background-repeat: no-repeat;\n    background-size: 100% 100%;\n    width: 100%;\n    height: 100%;\n    z-index: -1;\n    filter: opacity(0.25);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Banner = function Banner(props) {
  return /*#__PURE__*/_react.default.createElement(BannerView, {
    color: props.color,
    onClick: console.log,
    top: props.placement.top,
    right: props.placement.right
  }, props.text);
};

var BannerView = _styledComponents.default.div(_templateObject(), function (props) {
  return props.top;
}, function (props) {
  return props.right;
}, require("../images/banner.png"));

var _default = Banner;
exports.default = _default;