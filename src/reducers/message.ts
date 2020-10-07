import { Action, Actions } from "../actions/constants";
import { AppState } from "./store";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import randomColor from "randomcolor";

import {
  allPointShapes,
  PointI,
  AuthorI,
  PointsI,
  PointShape,
} from "../dataModels";
import {
  _PointCreateParams,
  PointUpdateParams,
  PointMoveParams,
  PointsDeleteParams,
  SetFocusParams,
  SetMainPointParams,
  CombinePointsParams,
  SplitIntoTwoPointsParams,
  SetMessageParams,
} from "../actions/messageActions";

export interface MessageState {
  _id: string;
  revisionOf?: string;
  author: AuthorI;
  points: PointsI;
  focus?: { _id: string; shape: PointShape };
  main?: string;
  createdAt: Date;
}

export const initialMessageState: MessageState = {
  _id: uuidv4(),
  author: { name: "anonymous", color: randomColor() },
  points: {
    facts: [],
    thoughts: [],
    feelings: [],
    needs: [],
    topics: [],
    actions: [],
    people: [],
  },
  createdAt: new Date(),
};

export const messageReducer = (
  state = initialMessageState,
  action: Action,
  appState: AppState
): MessageState => {
  let newState = state;
  switch (action.type) {
    case Actions.setMessage:
      newState = setMessage(state, action as Action<SetMessageParams>);
      break;
    case Actions.pointCreate:
      newState = handlePointCreate(state, action as Action<_PointCreateParams>);
      break;
    case Actions.pointUpdate:
      newState = handlePointUpdate(state, action as Action<PointUpdateParams>);
      break;
    case Actions.pointMove:
      newState = handlePointMove(state, action as Action<PointMoveParams>);
      break;
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>
      );
      break;
    case Actions.setFocus:
      newState = handleSetFocus(state, action as Action<SetFocusParams>);
      break;
    case Actions.setMainPoint:
      newState = handleSetMainPoint(
        state,
        action as Action<SetMainPointParams>
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<CombinePointsParams>
      );
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<SplitIntoTwoPointsParams>
      );
      break;
  }
  return newState;
};

function setMessage(
  state: MessageState,
  action: Action<SetMessageParams>
): MessageState {
  return action.params.message;
}

function handlePointCreate(
  state: MessageState,
  action: Action<_PointCreateParams>
): MessageState {
  const newPoints = state.points[action.params.shape].slice();
  newPoints.splice(action.params.index, 0, {
    ...action.params.point,
    _id: action.params.newPointId,
    pointDate: new Date(),
  });
  return action.params.focus
    ? {
        ...state,
        points: {
          ...state.points,
          [action.params.shape]: newPoints,
        },
        focus: {
          _id: action.params.newPointId,
          shape: action.params.shape,
        },
      }
    : {
        ...state,
        points: {
          ...state.points,
          [action.params.shape]: newPoints,
        },
      };
}

function handlePointUpdate(
  state: MessageState,
  action: Action<PointUpdateParams>
): MessageState {
  return {
    ...state,
    points: {
      ...state.points,
      [action.params.shape]: state.points[action.params.shape].map((p) => {
        if (p._id === action.params.point._id) {
          return action.params.point;
        }
        return p;
      }),
    },
  };
}

function handlePointMove(
  state: MessageState,
  action: Action<PointMoveParams>
): MessageState {
  const pointWithNewShape = state.points[action.params.oldShape].find(
    (p) => p._id === action.params.pointId
  ) as PointI;
  let newFocus = state.focus;
  if (state.focus && action.params.pointId === state.focus._id) {
    newFocus = undefined;
  }
  return action.params.oldShape === action.params.newShape
    ? {
        ...state,
        points: {
          ...state.points,
          [action.params.oldShape]: update(
            state.points[action.params.oldShape],
            {
              $splice: [
                [action.params.oldIndex, 1],
                [action.params.newIndex, 0, pointWithNewShape],
              ],
            }
          ),
        },
        focus: newFocus,
      }
    : {
        ...state,
        points: {
          ...state.points,
          [action.params.oldShape]: update(
            state.points[action.params.oldShape],
            {
              $splice: [[action.params.oldIndex, 1]],
            }
          ),
          [action.params.newShape]: update(
            state.points[action.params.newShape],
            {
              $splice: [[action.params.newIndex, 0, pointWithNewShape]],
            }
          ),
        },
        focus: newFocus,
      };
}

function handlePointsDelete(
  state: MessageState,
  action: Action<PointsDeleteParams>
): MessageState {
  return {
    ...state,
    points: allPointShapes.reduce((obj: PointsI, pointShape: PointShape) => {
      obj[pointShape] = state.points[pointShape].filter((p) => {
        return !action.params.pointIds.includes(p._id);
      });
      return obj;
    }, state.points),
  };
}

function handleSetFocus(
  state: MessageState,
  action: Action<SetFocusParams>
): MessageState {
  const intermediateState = handlePointMove(
    state,
    action as Action<PointMoveParams>
  );

  return {
    ...intermediateState,
    focus: { _id: action.params.pointId, shape: action.params.newShape },
  };
}

function handleSetMainPoint(
  state: MessageState,
  action: Action<SetMainPointParams>
): MessageState {
  return {
    ...state,
    main: action.params.pointId,
  };
}

function handleCombinePoints(
  state: MessageState,
  action: Action<CombinePointsParams>
): MessageState {
  const withinBounds = (index: number): boolean => {
    return index >= 0 && index < state.points[action.params.shape].length;
  };

  const isQuoted = (index: number): boolean => {
    return state.points[action.params.shape][index].quotedAuthor !== undefined;
  };

  // Don't attempt to combine a point with the point below it if no point
  // exists below it.
  if (!withinBounds(action.params.keepIndex) || !withinBounds(action.params.deleteIndex)) {
    return state;
  }

  // Don't combine points with quoted points:
  if (isQuoted(action.params.keepIndex) || isQuoted(action.params.deleteIndex)) {
    return state;
  }

  const pointToKeep = state.points[action.params.shape][action.params.keepIndex];
  const pointToDelete = state.points[action.params.shape][action.params.deleteIndex];

  const newContent = action.params.keepIndex < action.params.deleteIndex ?
    pointToKeep.content + pointToDelete.content : pointToDelete.content + pointToKeep.content;


  const newPoints = state.points[action.params.shape]
    .filter(point => point._id !== pointToDelete._id)
    .map(point => {
      return point._id === pointToKeep._id ? ({
        ...point,
        content: newContent,
      }) : point;
    });

  return {
    ...state,
    points: {
      ...state.points,
      [action.params.shape]: newPoints,
    },
  };
}

function handleSplitIntoTwoPoints(
  state: MessageState,
  action: Action<SplitIntoTwoPointsParams>
): MessageState {
  const splitPoints = state.points[action.params.shape].slice();
  splitPoints.splice(
    action.params.index,
    1,
    {
      ...state.points[action.params.shape][action.params.index],
      content: action.params.topPoint.content,
    },
    {
      ...action.params.bottomPoint,
      _id: action.params.newPointId,
      pointDate: new Date(),
    }
  );
  return {
    ...state,
    points: {
      ...state.points,
      [action.params.shape]: splitPoints,
    },
  };
}
