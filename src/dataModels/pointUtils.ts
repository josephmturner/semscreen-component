/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
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
): PointReferenceI | undefined {
  const point = getPointById(pointId, appState);
  if (isReference(point)) {
    return point;
  }
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
