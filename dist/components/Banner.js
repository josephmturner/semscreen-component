"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  text-align: center;\n  font-size: medium;\n  top: ", ";\n  right: ", ";\n  padding: 0;\n  z-index: 1;\n  cursor: pointer;\n  background-color: #ffffff;\n\n  &:before {\n    content: \"\";\n    position: absolute;\n    background-image: ", ";\n    background-repeat: no-repeat;\n    background-size: 133% 120%;\n    background-position: center;\n    width: 100%;\n    height: 100%;\n    z-index: -1;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Banner = function Banner(props) {
  return (
    /*#__PURE__*/
    // \u00A0 adds extra spaces on either side of the text
    _react.default.createElement(BannerView, {
      color: props.color,
      onClick: console.log,
      top: props.placement.top,
      right: props.placement.right
    }, "\xA0 ".concat(props.text, " \xA0"))
  );
};

var BannerView = _styledComponents.default.div(_templateObject(), function (props) {
  return props.top;
}, function (props) {
  return props.right;
}, function (props) {
  return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='450' width='450' preserveAspectRatio='none'> <path d='M391.908 347.474c-2.816 9.508-9.271 16.797-23.376 21.095 0 0-73.876 28.625-143.069 0-69.194-28.627-143.066 0-143.066 0-12.913 0-23.378-9.44-23.378-21.095V89.287c5.229-11.555 12.51-17.483 23.469-21.826 0 0 64.284-31.412 142.975.73 78.504 32.068 143.069 0 143.069 0 12.911 0 23.376 9.446 23.376 21.096z' fill='".concat(props.color && props.color.replace("#", "%23"), "' fill-opacity='0.1' stroke='").concat(props.color && props.color.replace("#", "%23"), "' stroke-width='1.5' vector-effect='non-scaling-stroke'/></svg>\")");
});

var _default = Banner;
exports.default = _default;