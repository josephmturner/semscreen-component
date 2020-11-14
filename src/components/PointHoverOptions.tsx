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
import React from "react";
import styled from "styled-components";

import PublishButton from "./PublishButton";
import { blackOrWhite } from "../dataModels/pointUtils";
import { PointHoverOptionsType } from "../dataModels/dataModels";

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers/store";
import { pointsMoveToMessage, pointsDelete } from "../actions/pointsActions";
import { messageDelete, setMainPoint } from "../actions/messagesActions";

interface Props {
  type: PointHoverOptionsType;
  id: string;
  darkMode?: boolean;
  isSelected?: boolean;
}

const PointHoverOptions = (props: Props) => {
  const dispatch = useDispatch();

  let trashDispatch: any;
  switch (props.type) {
    case "point":
      trashDispatch = () => dispatch(pointsDelete({ pointIds: [props.id] }));
      break;
    case "draftMessage":
      trashDispatch = () => dispatch(messageDelete({ messageId: props.id }));
      break;
  }

  const pointsAreSelected = useSelector(
    (state: AppState) => state.selectedPoints.pointIds[0] !== undefined
  );

  const currentMessageIsDraft = useSelector((state: AppState) =>
    state.messages.draftIds.includes(state.semanticScreen.currentMessage)
  );

  const PointsMoveButton = () => {
    return (
      <ButtonSvg
        onClick={(e: React.MouseEvent) => {
          dispatch(pointsMoveToMessage({ messageId: props.id }));
          e.stopPropagation();
        }}
        darkMode={props.darkMode}
        isSelected={props.isSelected}
        viewBox="0 0 16 16"
      >
        <title>{currentMessageIsDraft ? "Move points" : "Copy points"}</title>
        <path d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z" />
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
      </ButtonSvg>
    );
  };

  return (
    <StyledPointHoverOptions
      isSelected={props.isSelected}
      darkMode={props.darkMode}
    >
      {props.type === "point" && (
        <MainPointButton
          darkMode={props.darkMode}
          isSelected={props.isSelected}
          onClick={(e: React.MouseEvent) => {
            dispatch(setMainPoint({ pointId: props.id }));
            e.stopPropagation();
          }}
          title="Set main point"
        >
          !
        </MainPointButton>
      )}
      {props.type === "draftMessage" && pointsAreSelected && (
        <PointsMoveButton />
      )}
      {props.type === "draftMessage" && (
        <PublishButton messageId={props.id} darkMode={props.darkMode} />
      )}
      {(props.type === "point" || props.type === "draftMessage") && (
        <TrashButton
          onClick={(e: React.MouseEvent) => {
            // In persistedMessages trashDispatch is undefined
            if (trashDispatch) trashDispatch();
            e.stopPropagation();
          }}
          darkMode={props.darkMode}
          isSelected={props.isSelected}
          viewBox="0 0 16 16"
        >
          <title>
            {props.type === "draftMessage" ? "Delete message" : "Delete point"}
          </title>
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
        </TrashButton>
      )}
    </StyledPointHoverOptions>
  );
};

interface StyledProps {
  darkMode?: boolean;
  isSelected?: boolean;
}

const StyledPointHoverOptions = styled.div<StyledProps>`
  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  position: absolute;
  display: flex;
  align-items: center;
  margin: auto;
  top: 0;
  bottom: 0;
  right: 20px;
  height: 1rem;
  z-index: 10;
  background-color: var(--colorBG);
  border: 1px solid var(--colorFG);
  border-radius: 3px;
`;

export const ButtonSvg = styled.svg<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  fill: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    fill: var(--colorBG);
    background-color: var(--colorFG);
  }
`;

const MainPointButton = styled.div<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  color: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    color: var(--colorBG);
    background-color: var(--colorFG);
  }
`;

const TrashButton = styled.svg<StyledProps>`
  height: 100%;
  width: 0.8rem;
  padding: 0 3px;

  --colorFG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[0]};
  --colorBG: ${(props) => blackOrWhite(props.darkMode, props.isSelected)[1]};

  fill: var(--colorFG);
  background-color: var(--colorBG);
  border-radius: 3px;

  :hover {
    background-color: red;
  }
`;

export default PointHoverOptions;
