"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Point = _interopRequireDefault(require("./Point"));

var _NewPointButton = _interopRequireDefault(require("./NewPointButton"));

var _StyledRegion = _interopRequireDefault(require("./StyledRegion"));

var _RegionHeader = _interopRequireDefault(require("./RegionHeader"));

var _reactDnd = require("react-dnd");

var _ReactDnd = require("../constants/React-Dnd");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactRedux = require("react-redux");

var _pointsActions = require("../actions/pointsActions");

var _expandedRegionActions = require("../actions/expandedRegionActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  min-height: ", ";\n  height: 100%;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ShapeRegion = function ShapeRegion(props) {
  var shape = props.shape,
      pointIds = props.pointIds;

  var _useDrop = (0, _reactDnd.useDrop)({
    accept: _ReactDnd.ItemTypes.POINT,
    hover: function hover(item) {
      if (item.quoted && item.shape !== shape) return;

      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion({
          region: shape
        });
      }

      var newIndex = item.shape === shape && typeof item.index === "number" ? pointIds.length - 1 : pointIds.length; // TODO: some redundant logic, don't need if-else
      //Point was the focus (lacks index)

      if (typeof item.index !== "number") {
        props.pointMove({
          pointId: item.pointId,
          newShape: shape,
          newIndex: pointIds.length
        });
        item.index = newIndex;
        item.shape = shape;
      } else {
        //Point wasn't already at the bottom of this region
        if (item.shape !== shape || item.index !== pointIds.length - 1) {
          props.pointMove({
            pointId: item.pointId,
            oldIndex: item.index,
            newShape: shape,
            newIndex: newIndex
          });
          item.index = newIndex;
          item.shape = shape;
        }
      }
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      drop = _useDrop2[1];

  var createEmptyPoint = function createEmptyPoint() {
    props.pointCreate({
      point: {
        author: props.author,
        content: "",
        shape: shape
      },
      index: pointIds.length
    });
  };

  var onClickRemainingSpace = function onClickRemainingSpace() {
    if (props.isExpanded !== "expanded" && !props.readOnly) {
      createEmptyPoint();
    }
  };

  return /*#__PURE__*/_react.default.createElement(_StyledRegion.default, {
    borderColor: props.author.color,
    onClick: function onClick() {
      return props.setExpandedRegion({
        region: shape
      });
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_RegionHeader.default, {
    shape: shape,
    darkMode: props.darkMode
  }), pointIds.map(function (id) {
    return /*#__PURE__*/_react.default.createElement(_Point.default, {
      key: id,
      pointId: id,
      index: pointIds.findIndex(function (pId) {
        return pId === id;
      }),
      readOnly: props.readOnly,
      isExpanded: props.isExpanded,
      isSelected: props.selectedPoints.includes(id),
      darkMode: props.darkMode
    });
  }), props.isExpanded === "expanded" && !props.readOnly && /*#__PURE__*/_react.default.createElement(_NewPointButton.default, {
    shape: shape,
    onClick: createEmptyPoint,
    darkMode: props.darkMode
  }), /*#__PURE__*/_react.default.createElement(DropTargetDiv, {
    ref: drop,
    isExpanded: props.isExpanded,
    onClick: onClickRemainingSpace
  })));
};

var DropTargetDiv = _styledComponents.default.div(_templateObject(), function (props) {
  return props.isExpanded ? "50px" : 0;
});

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    author: state.message.author,
    pointIds: state.message.shapes[ownProps.shape],
    selectedPoints: state.selectedPoints.pointIds
  };
};

var mapDispatchToProps = {
  pointCreate: _pointsActions.pointCreate,
  pointMove: _pointsActions.pointMove,
  setExpandedRegion: _expandedRegionActions.setExpandedRegion
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ShapeRegion);

exports.default = _default;