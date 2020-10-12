"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledTextArea = exports.StyledImg = exports.StyledSpan = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  border: 0;\n  color: ", ";\n  background-color: transparent;\n  font-family: Arial;\n  font-size: ", ";\n  font-weight: ", ";\n  resize: none;\n  text-indent: ", ";\n  ", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  height: ", ";\n  top: ", ";\n  margin-top: ", ";\n  left: ", ";\n  opacity: 0.7;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  opacity: ", ";\n  ", "\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledSpan = _styledComponents.default.span(_templateObject(), function (props) {
  return props.isDragging ? 0.4 : 1;
}, function (props) {
  return props.quotedAuthor && "padding: 0.3rem 0.8rem 0.2rem 0.2rem;\n   ";
}, function (props) {
  return props.isSelected && "\n  background-color: #777;\n  border-radius: 5px;\n";
});

exports.StyledSpan = StyledSpan;

var StyledImg = _styledComponents.default.img(_templateObject2(), function (props) {
  return props.isMainPoint ? "23px" : "17px";
}, function (props) {
  return props.isMainPoint ? 0 : "2px";
}, function (props) {
  return props.quotedAuthor ? "0.8rem" : 0;
}, function (props) {
  return props.quotedAuthor ? "7px" : 0;
});

exports.StyledImg = StyledImg;
var StyledTextArea = (0, _styledComponents.default)(_reactTextareaAutosize.default)(_templateObject3(), function (props) {
  return props.darkMode ? "white" : "black";
}, function (props) {
  return props.isMainPoint ? "medium" : "small";
}, function (props) {
  return props.isMainPoint ? "bold" : "normal";
}, function (props) {
  return props.isMainPoint ? "2em" : "1.8em";
}, function (props) {
  return props.quotedAuthor && " border: 1.5px solid ".concat(props.quotedAuthor.color, "; border-top: 0.5rem solid ").concat(props.quotedAuthor.color, "; border-radius: 3px; padding: 3px 0 3px 3px;");
});
exports.StyledTextArea = StyledTextArea;