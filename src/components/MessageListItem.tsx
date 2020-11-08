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
import {
  getPointById,
  getReferenceData,
  getOriginalAuthorId,
} from "../dataModels/pointUtils";
import { StyledSpan, StyledTextArea } from "./StyledPoint";
import Banner from "./Banner";
import { MainPointShape } from "./MainPointShape";
import { useTextareaIndent } from "../hooks/useTextareaIndent";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  setCurrentMessage,
  SetCurrentMessageParams,
} from "../actions/semanticScreenActions";
import { pointsMove, PointsMoveParams } from "../actions/pointsActions";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

interface OwnProps {
  messageId: string;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  mainPoint: PointI | null;
  referenceData: PointReferenceI | null;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
  pointsMove: (params: PointsMoveParams) => void;
}

const MessageListItem = (props: AllProps) => {
  const { mainPoint, referenceData } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      props.pointsMove({ messageId: props.messageId });
    },
  });

  const spanRef = useRef<HTMLSpanElement>(null);

  drop(spanRef);

  const bannerRef = useRef<HTMLDivElement>(null);

  const { textareaIndent, textareaNewline } = useTextareaIndent(
    spanRef,
    bannerRef
  );

  //The useState and useEffect are purely to cause the component to
  //re-render after it first mounts. A better solution must exist.
  const [, setCounter] = useState(0);
  useEffect(() => {
    setCounter((c) => c + 1);
  }, [referenceData]);

  return (
    <>
      {mainPoint ? (
        <StyledSpan
          ref={spanRef}
          onClick={() =>
            props.setCurrentMessage({ messageId: props.messageId })
          }
          isMainPoint={true}
          isSelected={false}
          darkMode={props.darkMode}
        >
          <MainPointShape
            shape={mainPoint.shape}
            darkMode={props.darkMode}
            onClick={console.log}
          />
          {referenceData && (
            <Banner
              authorId={getOriginalAuthorId(referenceData)}
              placement={{ top: "0.1rem", left: "2.2em" }}
              darkMode={props.darkMode}
              ref={bannerRef}
            />
          )}
          <StyledTextArea
            value={mainPoint.content}
            readOnly={true}
            isMainPoint={true}
            darkMode={props.darkMode}
            indent={textareaIndent}
            newLine={textareaNewline}
          />
        </StyledSpan>
      ) : (
        <div>This message doesn't have any points yet!</div>
      )}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const mainPointId = state.messages.byId[ownProps.messageId].main;
  let mainPoint = null;
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
  pointsMove,
};

export default connect(mapStateToProps, mapActionsToProps)(MessageListItem);
