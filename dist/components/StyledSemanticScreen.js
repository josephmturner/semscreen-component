"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 100%;\n  width: 100%;\n  position: relative;\n  background-color: white;\n  padding: ", ";\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n\n  @media (max-width: 799px) {\n   --expanded-size: 1fr;\n   --minimized-size: 0fr;\n }\n \n  @media (min-width: 800px) {\n   --expanded-size: 4fr;\n   --minimized-size: 1fr;\n }\n  \n  ", "\n\n  ", "\n\n  ", "\n\n  ", "\n\n  ", "\n\n  ", "\n\n  ", "\n\n  ", "\n\n  ", "\n\n  > .Shape {\n  opacity: 0.33;\n  }\n\n  > #FactsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  }\n  > #MeritsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  top: 0%;\n  left: 50%;\n  transform: translate(-50%, 0%);\n  }\n  > #PeopleShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  top: 0%;\n  right: 0%;\n  }\n  > #ThoughtsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  top: 50%;\n  left: 0%;\n  transform: translate(0%, -50%);\n }\n  > #ActionsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  top: 50%;\n  right: 0%;\n  transform: translate(0%, -50%);\n }\n  > #FeelingsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  bottom: 0%;\n  left: 0%;\n }\n  > #NeedsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  bottom: 0%;\n  left: 50%;\n  transform: translate(-50%, 0%);\n }\n  > #TopicsShape {\n  position: absolute;\n  width: 2rem;\n  height: 2rem;\n  bottom: 0%;\n  right: 0%;\n }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledSemanticScreen = _styledComponents.default.div(_templateObject(), function (props) {
  return props.showShapes ? "2rem" : "0";
}, function (_ref) {
  var expandedRegion = _ref.expandedRegion;
  return expandedRegion === "facts" && "\n    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);\n    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);\n  ";
}, function (_ref2) {
  var expandedRegion = _ref2.expandedRegion;
  return expandedRegion === "merits" && "\n    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);\n    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);\n  ";
}, function (_ref3) {
  var expandedRegion = _ref3.expandedRegion;
  return expandedRegion === "people" && "\n    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);\n    grid-template-rows: var(--expanded-size) var(--minimized-size) var(--minimized-size);\n  ";
}, function (_ref4) {
  var expandedRegion = _ref4.expandedRegion;
  return expandedRegion === "thoughts" && "\n    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);\n    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);\n  ";
}, function (_ref5) {
  var expandedRegion = _ref5.expandedRegion;
  return expandedRegion === "focus" && "\n    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);\n    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);\n  ";
}, function (_ref6) {
  var expandedRegion = _ref6.expandedRegion;
  return expandedRegion === "actions" && "\n    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);\n    grid-template-rows: var(--minimized-size) var(--expanded-size) var(--minimized-size);\n  ";
}, function (_ref7) {
  var expandedRegion = _ref7.expandedRegion;
  return expandedRegion === "feelings" && "\n    grid-template-columns: var(--expanded-size) var(--minimized-size) var(--minimized-size);\n    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);\n  ";
}, function (_ref8) {
  var expandedRegion = _ref8.expandedRegion;
  return expandedRegion === "needs" && "\n    grid-template-columns: var(--minimized-size) var(--expanded-size) var(--minimized-size);\n    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);\n  ";
}, function (_ref9) {
  var expandedRegion = _ref9.expandedRegion;
  return expandedRegion === "topics" && "\n    grid-template-columns: var(--minimized-size) var(--minimized-size) var(--expanded-size);\n    grid-template-rows: var(--minimized-size) var(--minimized-size) var(--expanded-size);\n  ";
});

var _default = StyledSemanticScreen;
exports.default = _default;