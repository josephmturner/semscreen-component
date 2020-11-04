/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import { Action, Actions } from "./constants";
import { PointI, PointShape } from "../dataModels/dataModels";
import { v4 as uuidv4 } from "uuid";

//import { MessageState } from "../reducers/message";

//export interface SetMessageParams {
//  message: MessageState;
//}
//
//export const setMessage = (
//  params: SetMessageParams
//): Action<SetMessageParams> => {
//  return {
//    type: Actions.setMessage,
//    params: params,
//  };
//};

export interface MessageCreateParams {
  pointIds?: string[];
}

export interface _MessageCreateParams extends MessageCreateParams {
  newMessageId: string;
}

export const messageCreate = (
  params: MessageCreateParams
): Action<_MessageCreateParams> => {
  const newMessageId = uuidv4();
  return {
    type: Actions.messageCreate,
    params: {
      ...params,
      newMessageId,
    },
  };
};

export interface SetFocusParams {}

export const setFocus = (params: SetFocusParams): Action<SetFocusParams> => {
  return {
    type: Actions.setFocus,
    params,
  };
};

export interface SetMainPointParams {
  pointId: string;
}

export const setMainPoint = (
  params: SetMainPointParams
): Action<SetMainPointParams> => {
  return {
    type: Actions.setMainPoint,
    params,
  };
};

export interface SplitIntoTwoPointsParams {
  topPoint: PointI;
  bottomPoint: PointI;
  shape: PointShape;
  index: number;
  newPointId: string;
}

export const splitIntoTwoPoints = (
  params: SplitIntoTwoPointsParams
): Action<SplitIntoTwoPointsParams> => {
  return {
    type: Actions.splitIntoTwoPoints,
    params,
  };
};
