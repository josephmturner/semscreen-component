"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _getters = require("../dataModels/getters");

var _useDragPoint2 = require("../hooks/useDragPoint");

var _StyledPoint = require("./StyledPoint");

var _Banner = _interopRequireDefault(require("./Banner"));

var _reactRedux = require("react-redux");

var _pointsActions = require("../actions/pointsActions");

var _messageActions = require("../actions/messageActions");

var _selectPointActions = require("../actions/selectPointActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FocusPoint = function FocusPoint(props) {
  var point = props.point,
      pointId = props.pointId,
      isMainPoint = props.isMainPoint;
  var shape = point.shape;

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

  var _useDragPoint = (0, _useDragPoint2.useDragPoint)(pointId),
      isDragging = _useDragPoint.isDragging,
      drag = _useDragPoint.drag,
      preview = _useDragPoint.preview;

  return /*#__PURE__*/_react.default.createElement(_StyledPoint.StyledSpan, {
    onClick: handleClick,
    ref: preview,
    isMainPoint: isMainPoint,
    isDragging: isDragging,
    isSelected: props.isSelected,
    referenceAuthor: props.referenceAuthor
  }, /*#__PURE__*/_react.default.createElement(_StyledPoint.StyledImg, {
    ref: props.readOnly ? null : drag,
    src: imageUrl,
    onClick: onClickShapeIcon,
    isMainPoint: props.isMainPoint,
    referenceAuthor: props.referenceAuthor,
    darkMode: props.darkMode,
    alt: shape
  }), /*#__PURE__*/_react.default.createElement(_StyledPoint.StyledTextArea, {
    value: point.content,
    onChange: handleChange,
    onBlur: function onBlur() {
      if (!point.content) props.pointsDelete({
        pointIds: [point._id]
      });
    },
    readOnly: !!props.referenceAuthor || props.readOnly,
    isMainPoint: isMainPoint,
    referenceAuthor: props.referenceAuthor,
    darkMode: props.darkMode,
    autoFocus: true,
    onKeyDown: function onKeyDown(e) {
      if (props.readOnly) {
        return;
      } else {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }
    }
  }), props.referenceData && /*#__PURE__*/_react.default.createElement(_Banner.default, {
    authorId: props.referenceData.referenceAuthorId,
    placement: {
      top: "-0.5rem",
      right: "0.4rem"
    },
    darkMode: props.darkMode
  }));
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var referenceData = (0, _getters.getReferenceData)(ownProps.pointId, state.points);
  var referenceAuthor;

  if (referenceData) {
    referenceAuthor = state.authors.byId[referenceData.referenceAuthorId];
  }

  return {
    point: (0, _getters.getPointById)(ownProps.pointId, state.points),
    referenceData: referenceData,
    referenceAuthor: referenceAuthor
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