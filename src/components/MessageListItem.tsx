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
import React, { useEffect, useRef, useState } from "react";
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import { getPointById, getReferenceData } from "../dataModels/pointUtils";
import Point from "./Point";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  setCurrentMessage,
  SetCurrentMessageParams,
} from "../actions/semanticScreenActions";
import {
  pointsMoveToMessage,
  PointsMoveToMessageParams,
} from "../actions/pointsActions";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

interface OwnProps {
  messageId: string;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  mainPoint?: PointI;
  referenceData: PointReferenceI | null;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
  pointsMoveToMessage: (params: PointsMoveToMessageParams) => void;
}

const MessageListItem = (props: AllProps) => {
  const { referenceData } = props;

  //TODO: fix type of ref
  const pointRef = useRef<any>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      props.pointsMoveToMessage({ messageId: props.messageId });
    },
  });

  drop(pointRef.current?.span);

  const handlePointSpanClick = () => {
    props.pointsMoveToMessage({ messageId: props.messageId });
  };

  //The useState and useEffect are purely to cause the component to
  //re-render after it first mounts. A better solution must exist.
  const [, setCounter] = useState(0);
  useEffect(() => {
    setCounter((c) => c + 1);
  }, [referenceData]);

  return (
    <>
      {props.mainPoint && (
        <Point
          id={props.messageId}
          displayPoint={props.mainPoint}
          referenceData={props.referenceData}
          isMainPoint={true}
          isSelected={false}
          readOnlyOverride={true}
          darkMode={props.darkMode}
          suppressAutoFocus={true}
          handlePointSpanClick={handlePointSpanClick}
          ref={pointRef}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const mainPointId = state.messages.byId[ownProps.messageId].main;
  let mainPoint;
  let referenceData = null;

  if (mainPointId) {
    mainPoint = getPointById(mainPointId, state.points);
    referenceData = getReferenceData(mainPointId, state.points);
  }

  return {
    mainPoint,
    referenceData,
  };
};

const mapActionsToProps = {
  setCurrentMessage,
  pointsMoveToMessage,
};

export default connect(mapStateToProps, mapActionsToProps)(MessageListItem);
