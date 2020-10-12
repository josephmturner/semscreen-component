"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointById = getPointById;
exports.getReferencedPointId = getReferencedPointId;

function getPointById(pointId, pointsState) {
  if (pointsState.byId[pointId].referencePointId) {
    //TODO: why are the "as PointReferenceI" or "as PointI" type guard necessary here?
    var referencePointId = pointsState.byId[pointId].referencePointId;
    return pointsState.byId[referencePointId];
  } else {
    return pointsState.byId[pointId];
  }
}

function getReferencedPointId(pointId, pointsState) {
  var _referencePointId;

  return (_referencePointId = pointsState.byId[pointId].referencePointId) !== null && _referencePointId !== void 0 ? _referencePointId : undefined;
}