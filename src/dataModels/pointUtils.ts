import {
  PointShape,
  PointI,
  PointReferenceI,
  ReferenceLog,
} from "./dataModels";
import { AppState } from "../reducers";

export function hasPoints(messageId: string, state: AppState) {
  const message = getMessageById(messageId, state);
  return Object.values(message.shapes).flat()[0] || message.main;
}

export function isUserIdentity(id: string, state: AppState) {
  return state.userIdentities.allIds.includes(id);
}

export function isReference(p: PointI | PointReferenceI): p is PointReferenceI {
  return (p as PointReferenceI).referenceHistory !== undefined;
}

export function getPointById(pointId: string, appState: AppState) {
  const isDraftPoint = appState.draftPoints.allIds.includes(pointId);
  return isDraftPoint
    ? appState.draftPoints.byId[pointId]
    : appState.points.byId[pointId];
}

export function getMessageById(messageId: string, appState: AppState) {
  const isDraftMessage = appState.draftMessages.allIds.includes(messageId);
  return isDraftMessage
    ? appState.draftMessages.byId[messageId]
    : appState.messages.byId[messageId];
}

export function getPointIfReference(
  pointId: string,
  appState: AppState
): PointI {
  const point = getPointById(pointId, appState);
  return isReference(point)
    ? (appState.points.byId[getOriginalPointId(point)] as PointI)
    : point;
}

export function getReferencedPointId(
  pointId: string,
  appState: AppState
): string | null {
  const point = getPointById(pointId, appState);
  return isReference(point) ? getOriginalPointId(point) : null;
}

export function getReferenceData(
  pointId: string,
  appState: AppState
): PointReferenceI | null {
  const point = getPointById(pointId, appState);
  return isReference(point) ? point : null;
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

export function getOriginalShape(
  point: PointReferenceI,
  appState: AppState
): PointShape {
  const pointId = getOriginalPointId(point);
  return (getPointById(pointId, appState) as PointI).shape;
}

export const containsPoints = (
  messageId: string,
  appState: AppState
): boolean => {
  const message = getMessageById(messageId, appState);
  return (
    Object.values(message.shapes).flat().length !== 0 ||
    message.main !== undefined
  );
};

export function blackOrWhite(
  darkMode?: boolean,
  isSelected?: boolean
): ("black" | "white")[] {
  let bool = true;
  if (darkMode) bool = !bool;
  if (isSelected) bool = !bool;

  return bool ? ["black", "white"] : ["white", "black"];
}
