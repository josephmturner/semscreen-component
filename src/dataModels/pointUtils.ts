import { v4 as uuidv4 } from "uuid";

import { PointShape, PointI, PointReferenceI, ReferenceLog } from "./dataModels";
import { PointsState } from "../reducers/points";
import { AppState } from "../reducers/store";


export function isReference(p: PointI | PointReferenceI): p is PointReferenceI {
  return (p as PointReferenceI).referenceHistory !== undefined;
}

export function getPointById(
  pointId: string,
  pointsState: PointsState
): PointI {
  const point = pointsState.byId[pointId];
  return isReference(point)
    ? (pointsState.byId[getOriginalPointId(point)] as PointI)
    : point;
}

export function getReferencedPointId(
  pointId: string,
  pointsState: PointsState
): string | null {
  const point = pointsState.byId[pointId];
  return isReference(point) ? getOriginalPointId(point) : null;
}

export function getReferenceData(
  pointId: string,
  pointsState: PointsState
): PointReferenceI | null {
  const point = pointsState.byId[pointId];
  return isReference(point) ? point : null;
}

export function createReferenceTo(pointId: string, appState: AppState): PointReferenceI {
  const point = appState.points.byId[pointId];
  const messageId = appState.semanticScreen.currentMessage;
  const authorId = appState.messages.byId[messageId].author;
  const newPointId = uuidv4();

  const referenceHistory = isReference(point) ? [...point.referenceHistory] : [];
  referenceHistory.push({
    pointId,
    messageId,
    authorId,
  });

  return {
    _id: newPointId,
    referenceHistory,
  };
}

function getOriginalReferenceLog(point: PointReferenceI): ReferenceLog {
  return point.referenceHistory[0];
}

export function getOriginalMessageId(point: PointReferenceI): string {
  return getOriginalReferenceLog(point).messageId;
}

export function getOriginalPointId(point: PointReferenceI): string {
  return getOriginalReferenceLog(point).pointId;
}

export function getOriginalAuthorId(point: PointReferenceI): string {
  return getOriginalReferenceLog(point).authorId;
}

export function getOriginalShape(point: PointReferenceI, pointsState: PointsState): PointShape {
  const pointId = getOriginalPointId(point);
  return (pointsState.byId[pointId] as PointI).shape;
}
