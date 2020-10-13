import { PointI, PointReferenceI } from "./dataModels";
import { PointsState } from "../reducers/points";

function isReference(p: PointI | PointReferenceI): p is PointReferenceI {
  return (p as PointReferenceI).referencePointId !== undefined;
}

export function getPointById(
  pointId: string,
  pointsState: PointsState
): PointI {
  const point = pointsState.byId[pointId];
  return isReference(point) ? pointsState.byId[point.referencePointId] as PointI : point;
}

export function getReferencedPointId(
  pointId: string,
  pointsState: PointsState
): string | null {
  const point = pointsState.byId[pointId];
  return isReference(point) ? point.referencePointId : null;
}

export function getReferenceData(pointId: string, pointsState: PointsState): PointReferenceI | null {
  const point = pointsState.byId[pointId];
  return isReference(point) ? point : null;
}
