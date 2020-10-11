"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _useDragPoint2 = require("../hooks/useDragPoint");

var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Banner = _interopRequireDefault(require("./Banner"));

var _reactRedux = require("react-redux");

var _pointsActions = require("../actions/pointsActions");

var _messageActions = require("../actions/messageActions");

var _selectPointActions = require("../actions/selectPointActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  border: 0px;\n  color: ", ";\n  background-color: transparent;\n  font-family: arial;\n  font-size: medium;\n  font-weight: ", ";\n  outline: 0;\n  resize: none;\n  ", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  height: 20px;\n  margin: auto;\n  opacity: 0.7;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  margin: auto;\n  display: flex;\n  opacity: ", ";\n\n  ", ";\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FocusPoint = function FocusPoint(props) {
  var point = props.point,
      pointId = props.pointId,
      isMainPoint = props.isMainPoint;
  var shape = point.shape;
  var ref = (0, _react.useRef)(null);

  var handleChange = function handleChange(e) {
    props.pointUpdate({
      point: _objectSpread(_objectSpread({}, point), {}, {
        content: e.target.value
      })
    });
  };

  var handleClick = function handleClick(e) {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }

    if (e.ctrlKey) {
      props.togglePoint({
        pointId: pointId
      });
    } else {
      props.setSelectedPoints({
        pointIds: []
      });
    }
  };

  var onClickShapeIcon = function onClickShapeIcon() {
    if (!props.readOnly) {
      props.setMainPoint({
        pointId: pointId
      });
    }
  };

  var imageUrl = require("../images/".concat(shape, ".svg"));

  var _useDragPoint = (0, _useDragPoint2.useDragPoint)(point),
      isDragging = _useDragPoint.isDragging,
      drag = _useDragPoint.drag,
      preview = _useDragPoint.preview;

  return /*#__PURE__*/_react.default.createElement(StyledSpan, {
    ref: preview,
    onClick: handleClick,
    isMainPoint: isMainPoint,
    isDragging: isDragging,
    isSelected: props.isSelected,
    quotedAuthor: point.quotedAuthor
  }, /*#__PURE__*/_react.default.createElement(StyledImg, {
    ref: props.readOnly ? null : drag,
    src: imageUrl,
    onClick: onClickShapeIcon,
    quotedAuthor: point.quotedAuthor,
    height: isMainPoint ? 30 : 20,
    darkMode: props.darkMode,
    alt: shape
  }), /*#__PURE__*/_react.default.createElement(StyledTextArea, {
    value: point.content,
    onChange: handleChange,
    onBlur: function onBlur() {
      if (!point.content) props.pointsDelete({
        pointIds: [point._id]
      });
    },
    readOnly: !!point.quotedAuthor || props.readOnly,
    ref: ref,
    autoFocus: true,
    isMainPoint: isMainPoint,
    quotedAuthor: point.quotedAuthor,
    darkMode: props.darkMode
  }), point.quotedAuthor && /*#__PURE__*/_react.default.createElement(_Banner.default, {
    text: point.quotedAuthor.name,
    color: point.quotedAuthor.color,
    placement: {
      top: "-0.5rem",
      right: "0.4rem"
    },
    darkMode: props.darkMode
  }));
};

var StyledSpan = _styledComponents.default.span(_templateObject(), function (props) {
  return props.isDragging ? 0.4 : 1;
}, function (props) {
  return props.isMainPoint && "\n  padding: 1% 0;\n";
}, function (props) {
  return props.isSelected && "                                                                  \n  background-color: #777;                                          \n  border-radius: 5px;\n";
});

var StyledImg = _styledComponents.default.img(_templateObject2());

var StyledTextArea = (0, _styledComponents.default)(_reactTextareaAutosize.default)(_templateObject3(), function (props) {
  return props.darkMode ? "#fff" : "#000";
}, function (props) {
  return props.isMainPoint ? "bold" : "normal";
}, function (props) {
  return props.quotedAuthor && " border: 1.5px solid ".concat(props.quotedAuthor.color, "; border-top: 0.5rem solid ").concat(props.quotedAuthor.color, "; border-radius: 3px; padding: 3px 0 3px 3px;");
});

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    point: state.points.byId[ownProps.pointId]
  };
};

var mapActionsToProps = {
  pointUpdate: _pointsActions.pointUpdate,
  setMainPoint: _messageActions.setMainPoint,
  togglePoint: _selectPointActions.togglePoint,
  setSelectedPoints: _selectPointActions.setSelectedPoints,
  pointsDelete: _pointsActions.pointsDelete
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapActionsToProps)(FocusPoint);

exports.default = _default;