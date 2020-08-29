"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  opacity: 0.4;\n  margin-top: 1px;\n  font-size: small;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  height: 17px;\n  margin: 0px 4px 0 2px;\n  opacity: 0.4;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  padding-top: 2px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Placeholder = function Placeholder(props) {
  var text = props.text,
      img = props.img,
      imgAlt = props.imgAlt,
      onClick = props.onClick;

  var handleClick = function handleClick(e) {
    e.stopPropagation();
    onClick();
  };

  return /*#__PURE__*/_react.default.createElement(StyledSpan, {
    onClick: handleClick
  }, /*#__PURE__*/_react.default.createElement(StyledImg, {
    src: img,
    alt: imgAlt
  }), /*#__PURE__*/_react.default.createElement(StyledDiv, null, text));
};

var StyledSpan = _styledComponents.default.span(_templateObject());

var StyledImg = _styledComponents.default.img(_templateObject2());

var StyledDiv = _styledComponents.default.div(_templateObject3());

var _default = Placeholder;
exports.default = _default;