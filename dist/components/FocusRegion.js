"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _FocusPoint = _interopRequireDefault(require("./FocusPoint"));

var _StyledRegion = _interopRequireDefault(require("./StyledRegion"));

var _SevenShapes = _interopRequireDefault(require("./SevenShapes"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactDnd = require("react-dnd");

var _ReactDnd = require("../constants/React-Dnd");

var _reactRedux = require("react-redux");

var _pointsActions = require("../actions/pointsActions");

var _messageActions = require("../actions/messageActions");

var _expandedRegionActions = require("../actions/expandedRegionActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n"]);

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

//TODO: don't pass region to FocusRegion, since its only ever the
//Focus region
var FocusRegion = function FocusRegion(props) {
  var region = props.region,
      isExpanded = props.isExpanded,
      pointId = props.pointId;

  var _useDrop = (0, _reactDnd.useDrop)({
    accept: _ReactDnd.ItemTypes.POINT,
    hover: function hover() {
      if (isExpanded !== "expanded") {
        props.setExpandedRegion({
          region: region
        });
      }
    },
    drop: function drop(item) {
      if (typeof item.index === "number") {
        props.setFocus({
          pointId: item.pointId,
          oldIndex: item.index,
          originalShape: item.originalShape
        });
      }
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      drop = _useDrop2[1];

  var createEmptyFocus = function createEmptyFocus(shape) {
    props.pointCreate({
      point: {
        author: props.author,
        content: "",
        shape: shape
      },
      focus: true
    });
  };

  return /*#__PURE__*/_react.default.createElement(_StyledRegion.default, {
    borderColor: props.author.color,
    onClick: function onClick() {
      return props.setExpandedRegion({
        region: region
      });
    },
    ref: drop
  }, /*#__PURE__*/_react.default.createElement(StyledDiv, null, pointId && /*#__PURE__*/_react.default.createElement(_FocusPoint.default, {
    pointId: pointId,
    readOnly: props.readOnly,
    isExpanded: props.isExpanded,
    isMainPoint: props.isMainPoint,
    isSelected: props.selectedPoints.includes(pointId),
    darkMode: props.darkMode
  }), !pointId && isExpanded === "expanded" && /*#__PURE__*/_react.default.createElement(_SevenShapes.default, {
    onShapeClick: createEmptyFocus,
    darkMode: props.darkMode
  })));
};

var StyledDiv = _styledComponents.default.div(_templateObject());

var mapStateToProps = function mapStateToProps(state) {
  var isMainPoint = state.message.focus === state.message.main;
  return {
    author: state.message.author,
    pointId: state.message.focus,
    selectedPoints: state.selectedPoints.pointIds,
    isMainPoint: isMainPoint
  };
};

var mapDispatchToProps = {
  setFocus: _messageActions.setFocus,
  setExpandedRegion: _expandedRegionActions.setExpandedRegion,
  pointCreate: _pointsActions.pointCreate
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FocusRegion);

exports.default = _default;