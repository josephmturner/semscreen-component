"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDragPoint = void 0;

var _reactDnd = require("react-dnd");

var _ReactDnd = require("../constants/React-Dnd");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useDragPoint = function useDragPoint(point, index) {
  var _useDrag = (0, _reactDnd.useDrag)({
    item: {
      type: _ReactDnd.ItemTypes.POINT,
      pointId: point._id,
      shape: point.shape,
      index: index,
      originalShape: point.shape,
      quoted: !!point.quotedAuthor
    },
    collect: function collect(monitor) {
      return {
        isDragging: monitor.isDragging()
      };
    },
    isDragging: function isDragging(monitor) {
      return point._id === monitor.getItem().pointId;
    }
  }),
      _useDrag2 = _slicedToArray(_useDrag, 3),
      isDragging = _useDrag2[0].isDragging,
      drag = _useDrag2[1],
      preview = _useDrag2[2];

  return {
    isDragging: isDragging,
    drag: drag,
    preview: preview
  };
};

exports.useDragPoint = useDragPoint;