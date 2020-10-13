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
): string | undefined {
  const point = pointsState.byId[pointId];
  return isReference(point) ? point.referencePointId : undefined;
}
