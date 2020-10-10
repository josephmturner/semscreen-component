"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _SemanticScreen = _interopRequireDefault(require("./components/SemanticScreen"));

var _PanelButton = _interopRequireDefault(require("./components/PanelButton"));

var _ParkingSpace = _interopRequireDefault(require("./components/ParkingSpace"));

var _panelsActions = require("./actions/panelsActions");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  height: 4rem;\n  width: 100%;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 100%;\n  width: 16rem;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  height: ", ";\n  width: ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 100%;\n\n  ", "\n\n  *>div {\n    scrollbar-color: var(--thumbBG) var(--scrollbarBG);\n    scrollbar-width: thin;\n  }\n  * > div ::-webkit-scrollbar {\n    width: 11px;\n  }\n  * > div ::-webkit-scrollbar-thumb {\n    background-color: var(--thumbBG);\n    border: 3px solid var(--scrollbarBG);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var App = function App(props) {
  var readOnly = false;
  var darkMode = true;
  return /*#__PURE__*/_react.default.createElement(AppStyles, {
    darkMode: darkMode
  }, /*#__PURE__*/_react.default.createElement(SemscreenPanel, {
    right: props.panels.right,
    bottom: props.panels.bottom
  }, /*#__PURE__*/_react.default.createElement(_SemanticScreen.default, {
    readOnly: readOnly || false,
    darkMode: darkMode || false
  })), !props.panels.right && /*#__PURE__*/_react.default.createElement(_PanelButton.default, {
    side: "right",
    openClose: "open",
    onClick: function onClick() {
      props.showPanel({
        location: "right"
      });
    },
    darkMode: darkMode
  }), props.panels.right && /*#__PURE__*/_react.default.createElement(RightPanel, null, /*#__PURE__*/_react.default.createElement(_ParkingSpace.default, {
    darkMode: darkMode
  }), /*#__PURE__*/_react.default.createElement(_PanelButton.default, {
    side: "right",
    openClose: "close",
    onClick: function onClick() {
      return props.hidePanel({
        location: "right"
      });
    },
    darkMode: darkMode
  })), !props.panels.bottom && /*#__PURE__*/_react.default.createElement(_PanelButton.default, {
    side: "bottom",
    openClose: "open",
    onClick: function onClick() {
      props.showPanel({
        location: "bottom"
      });
    },
    darkMode: darkMode
  }), props.panels.bottom && /*#__PURE__*/_react.default.createElement(BottomPanel, null, /*#__PURE__*/_react.default.createElement(_ParkingSpace.default, {
    darkMode: darkMode
  }), /*#__PURE__*/_react.default.createElement(_PanelButton.default, {
    side: "bottom",
    openClose: "close",
    onClick: function onClick() {
      return props.hidePanel({
        location: "bottom"
      });
    },
    darkMode: darkMode
  })));
};

var AppStyles = _styledComponents.default.div(_templateObject(), function (props) {
  return props.darkMode ? "\n    --thumbBG: #7e7e7e;\n    --scrollbarBG: black;\n  " : "\n    --thumbBG: #696969;\n    --scrollbarBG: white;\n  ";
});

var SemscreenPanel = _styledComponents.default.div(_templateObject2(), function (props) {
  return props.bottom ? "calc(100% - 4rem)" : "100%";
}, function (props) {
  return props.right ? "calc(100% - 16rem)" : "100%";
});

var RightPanel = _styledComponents.default.div(_templateObject3());

var BottomPanel = _styledComponents.default.div(_templateObject4());

var mapStateToProps = function mapStateToProps(state) {
  return {
    panels: state.panels
  };
};

var mapActionsToProps = {
  showPanel: _panelsActions.showPanel,
  hidePanel: _panelsActions.hidePanel
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapActionsToProps)(App);

exports.default = _default;