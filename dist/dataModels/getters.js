"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointById = getPointById;
exports.getReferencedPointId = getReferencedPointId;
exports.getReferenceData = getReferenceData;

function isReference(p) {
  return p.referencePointId !== undefined;
}

function getPointById(pointId, pointsState) {
  var point = pointsState.byId[pointId];
  return isReference(point) ? pointsState.byId[point.referencePointId] : point;
}

function getReferencedPointId(pointId, pointsState) {
  var point = pointsState.byId[pointId];
  return isReference(point) ? point.referencePointId : null;
}

function getReferenceData(pointId, pointsState) {
  var point = pointsState.byId[pointId];
  return isReference(point) ? point : null;
}