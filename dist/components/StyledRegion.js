"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  overflow: hidden;\n  &:hover {\n    overflow-y: auto;\n  }\n\n  border: 2px solid ", ";\n  border-radius: 7px;\n  margin: 0.5px;\n\n  & > div {\n    display: flex;\n    height: 100%;\n    flex-direction: column;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledRegion = _styledComponents.default.div(_templateObject(), function (props) {
  return props.borderColor;
});

var _default = StyledRegion;
exports.default = _default;