import { PointI, PointReferenceI } from "./dataModels";
import { PointsState } from "../reducers/points";

export function getPointById(
  pointId: string,
  pointsState: PointsState
): PointI {
  if ((pointsState.byId[pointId] as PointReferenceI).referencePointId) {
    //TODO: why are the "as PointReferenceI" or "as PointI" type guard necessary here?
    const referencePointId = (pointsState.byId[pointId] as PointReferenceI)
      .referencePointId;
    return pointsState.byId[referencePointId] as PointI;
  } else {
    return pointsState.byId[pointId] as PointI;
  }
}

export function getReferencedPointId(
  pointId: string,
  pointsState: PointsState
): string | undefined {
  return (
    (pointsState.byId[pointId] as PointReferenceI).referencePointId ?? undefined
  );
}
