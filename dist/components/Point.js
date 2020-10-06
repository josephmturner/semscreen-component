"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ReactDnd = require("../constants/React-Dnd");

var _Banner = _interopRequireDefault(require("./Banner"));

var _uuid = require("uuid");

var _reactDnd = require("react-dnd");

var _useDragPoint2 = require("../hooks/useDragPoint");

var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactRedux = require("react-redux");

var _cursorPositionActions = require("../actions/cursorPositionActions");

var _messageActions = require("../actions/messageActions");

var _expandedRegionActions = require("../actions/expandedRegionActions");

var _selectPointActions = require("../actions/selectPointActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  border: 0;\n  color: ", ";\n  background-color: transparent;\n  font-family: arial;\n  font-size: ", ";\n  font-weight: ", ";\n  outline: 0;\n  resize: none;\n  overflow: hidden;\n  text-indent: ", ";\n  ", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  top: ", ";\n  margin-top: ", ";\n  left: ", ";\n  opacity: 0.7;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  left: 2px;\n  opacity: ", ";\n  padding-top: ", ";\n  margin-right: 4px;\n  ", "\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Point = function Point(props) {
  var point = props.point,
      shape = props.shape,
      index = props.index,
      combinePoints = props.combinePoints,
      cursorPositionIndex = props.cursorPositionIndex,
      clearCursorPosition = props.clearCursorPosition,
      setCursorPosition = props.setCursorPosition;

  var createPointBelow = function createPointBelow(topContent, bottomContent) {
    var newPointId = (0, _uuid.v4)();
    props.splitIntoTwoPoints({
      topPoint: {
        content: topContent,
        _id: point._id,
        pointDate: new Date()
      },
      bottomPoint: {
        content: bottomContent,
        _id: newPointId,
        pointDate: new Date()
      },
      shape: shape,
      index: index,
      newPointId: newPointId
    });
  };

  var _useDrop = (0, _reactDnd.useDrop)({
    accept: _ReactDnd.ItemTypes.POINT,
    hover: function hover(item, monitor) {
      var _ref$current;

      if (!ref.current || item.quoted && item.shape !== shape) {
        return;
      }

      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion(shape);
      } //TODO: only call the following logic after the animation transition ends. 150ms timeout?


      var dragIndex = item.index;
      var hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      var hoverBoundingRect = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.getBoundingClientRect();
      var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      var clientOffset = monitor.getClientOffset();
      var hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.pointMove({
        pointId: item.pointId,
        oldShape: item.shape,
        oldIndex: item.index,
        newShape: shape,
        newIndex: hoverIndex
      });
      item.index = hoverIndex;
      item.shape = shape;
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      drop = _useDrop2[1];

  var ref = (0, _react.useRef)(null);
  var pointRef = (0, _react.useRef)(null);

  var _useDragPoint = (0, _useDragPoint2.useDragPoint)(point, shape, index),
      isDragging = _useDragPoint.isDragging,
      drag = _useDragPoint.drag,
      preview = _useDragPoint.preview;

  drop(preview(pointRef));
  (0, _react.useEffect)(function () {
    if (!isNaN(cursorPositionIndex) && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(cursorPositionIndex, cursorPositionIndex);
      clearCursorPosition();
    }
  }, [cursorPositionIndex, clearCursorPosition]);

  var _useState = (0, _react.useState)(undefined),
      _useState2 = _slicedToArray(_useState, 2),
      arrowPressed = _useState2[0],
      setArrowPressed = _useState2[1];

  (0, _react.useEffect)(function () {
    if (arrowPressed === "ArrowUp" && ref.current) {
      ref.current && ref.current.selectionStart === 0 && setCursorPosition({
        moveTo: "beginningOfPriorPoint",
        index: index,
        shape: shape
      });
    } else if (arrowPressed === "ArrowDown" && ref.current) {
      ref.current && ref.current.selectionStart === point.content.length && setCursorPosition({
        moveTo: "beginningOfNextPoint",
        index: index,
        shape: shape
      });
    }

    setArrowPressed(undefined);
  }, [arrowPressed, index, point.content.length, setCursorPosition, shape]);

  var handleChange = function handleChange(e) {
    props.pointUpdate({
      point: _objectSpread(_objectSpread({}, point), {}, {
        content: e.target.value
      }),
      shape: shape
    });
  };

  var imageUrl = require("../images/".concat(shape, ".svg"));

  var handleClick = function handleClick(e) {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }

    if (e.ctrlKey) {
      props.togglePoint({
        pointId: point._id
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
        pointId: point._id
      });
    }
  };

  return /*#__PURE__*/_react.default.createElement(StyledSpan, {
    onClick: handleClick,
    ref: pointRef,
    isMainPoint: props.isMainPoint,
    isDragging: isDragging,
    isFirst: index === 0 ? true : false,
    isSelected: props.isSelected,
    quotedAuthor: point.quotedAuthor
  }, /*#__PURE__*/_react.default.createElement(StyledImg, {
    ref: props.readOnly ? null : drag,
    src: imageUrl,
    onClick: onClickShapeIcon,
    isMainPoint: props.isMainPoint,
    darkMode: props.darkMode,
    quotedAuthor: point.quotedAuthor,
    height: props.isMainPoint ? 23 : 17,
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
    isMainPoint: props.isMainPoint,
    quotedAuthor: point.quotedAuthor,
    darkMode: props.darkMode,
    ref: ref,
    autoFocus: true,
    onKeyDown: function onKeyDown(e) {
      if (props.readOnly) {
        return;
      } else {
        if (e.key === "Enter") {
          e.preventDefault();
          ref.current && !!point.content && createPointBelow(point.content.slice(0, ref.current.selectionStart), point.content.slice(ref.current.selectionStart));
        } else if (e.key === "Backspace" && ref.current && ref.current.selectionStart === 0 && ref.current.selectionStart === ref.current.selectionEnd) {
          if (index !== 0) {
            e.preventDefault();
            combinePoints({
              aboveOrBelow: "above",
              point: point,
              shape: shape,
              index: index
            });
          } else if (index === 0 && !point.content) {
            e.preventDefault();
            combinePoints({
              aboveOrBelow: "below",
              point: point,
              shape: shape,
              index: index
            });
          }
        } else if (e.key === "Delete" && ref.current && ref.current.selectionStart === point.content.length && ref.current.selectionStart === ref.current.selectionEnd) {
          e.preventDefault();
          combinePoints({
            aboveOrBelow: "below",
            point: point,
            shape: shape,
            index: index
          });
        } else if (e.key === "ArrowLeft" && ref.current && ref.current.selectionStart === 0 && ref.current.selectionStart === ref.current.selectionEnd && index !== 0) {
          e.preventDefault();
          setCursorPosition({
            moveTo: "endOfPriorPoint",
            index: index,
            shape: shape
          });
        } else if (e.key === "ArrowRight" && ref.current && ref.current.selectionStart === point.content.length && ref.current.selectionStart === ref.current.selectionEnd) {
          e.preventDefault();
          setCursorPosition({
            moveTo: "beginningOfNextPoint",
            index: index,
            shape: shape
          });
        } else if (e.key === "ArrowUp" && index !== 0) {
          setArrowPressed("ArrowUp");
        } else if (e.key === "ArrowDown") {
          setArrowPressed("ArrowDown");
        }
      }
    }
  }), point.quotedAuthor && /*#__PURE__*/_react.default.createElement(_Banner.default, {
    text: point.quotedAuthor.name,
    color: point.quotedAuthor.color,
    placement: {
      top: "-0.15rem",
      right: "0.8rem"
    },
    darkMode: props.darkMode
  }));
};

var StyledSpan = _styledComponents.default.span(_templateObject(), function (props) {
  return props.isDragging ? 0.4 : 1;
}, function (props) {
  return props.isFirst ? "1px" : "0px";
}, function (props) {
  return props.quotedAuthor && "padding: 0.3rem 0.8rem 0.2rem 0.2rem;\n   ";
}, function (props) {
  return props.isSelected && "                                                                  \n  background-color: #777;                                          \n  border-radius: 5px;\n";
});

var StyledImg = _styledComponents.default.img(_templateObject2(), function (props) {
  return props.isMainPoint ? 0 : "2px";
}, function (props) {
  return props.quotedAuthor ? "0.8rem" : 0;
}, function (props) {
  return props.quotedAuthor ? "7px" : 0;
});

var StyledTextArea = (0, _styledComponents.default)(_reactTextareaAutosize.default)(_templateObject3(), function (props) {
  return props.darkMode ? "#fff" : "#000";
}, function (props) {
  return props.isMainPoint ? "medium" : "small";
}, function (props) {
  return props.isMainPoint ? "bold" : "normal";
}, function (props) {
  return props.isMainPoint ? "1.6em" : "1.4em";
}, function (props) {
  return props.quotedAuthor && " border: 1.5px solid ".concat(props.quotedAuthor.color, "; border-top: 0.5rem solid ").concat(props.quotedAuthor.color, "; border-radius: 3px; padding: 3px 0 3px 3px;");
});

var mapStateToProps = function mapStateToProps() {
  return {};
};

var mapActionsToProps = {
  splitIntoTwoPoints: _messageActions.splitIntoTwoPoints,
  combinePoints: _messageActions.combinePoints,
  setCursorPosition: _cursorPositionActions.setCursorPosition,
  clearCursorPosition: _cursorPositionActions.clearCursorPosition,
  pointMove: _messageActions.pointMove,
  pointUpdate: _messageActions.pointUpdate,
  setMainPoint: _messageActions.setMainPoint,
  setExpandedRegion: _expandedRegionActions.setExpandedRegion,
  togglePoint: _selectPointActions.togglePoint,
  setSelectedPoints: _selectPointActions.setSelectedPoints,
  pointsDelete: _messageActions.pointsDelete
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapActionsToProps)(Point);

exports.default = _default;