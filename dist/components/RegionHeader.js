"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: justify;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var RegionHeader = function RegionHeader(props) {
  var imageUrl = require("../images/".concat(props.shape, ".svg"));

  return /*#__PURE__*/_react.default.createElement(StyledSpan, {
    style: {
      color: "white",
      margin: "auto",
      fontSize: "small"
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: imageUrl,
    height: 17
  }), props.shape.slice(0, 1).toUpperCase() + props.shape.slice(1));
};

var StyledSpan = _styledComponents.default.span(_templateObject());

var _default = RegionHeader;
exports.default = _default;