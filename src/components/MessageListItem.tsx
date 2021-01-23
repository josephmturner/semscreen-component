/*
  Copyright (C) 2021 by USHIN, Inc.

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
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import {
  AuthorI,
  PointI,
  PointReferenceI,
  SemanticScreenRouteParams,
} from "../dataModels/dataModels";
import {
  getPointIfReference,
  getMessageById,
  getReferenceData,
  isUserIdentity,
} from "../dataModels/pointUtils";
import Point from "./Point";
import Banner from "./Banner";
import { Hamburger } from "./Hamburger";
import { HoverContainer } from "./hover-buttons/HoverContainer";
import { PointsMoveButton } from "./hover-buttons/PointsMoveButton";
import { PublishButton } from "./hover-buttons/PublishButton";
import { TrashButton } from "./hover-buttons/TrashButton";

import { useHoverOptions } from "../hooks/useHoverOptions";

import { connect } from "react-redux";
import { AppState } from "../reducers";
import {
  setCurrentMessage,
  SetCurrentMessageParams,
} from "../actions/selectPointActions";
import {
  pointsMoveToMessage,
  PointsMoveToMessageParams,
} from "../actions/draftPointsActions";
import {
  draftMessageDelete,
  DraftMessageDeleteParams,
} from "../actions/draftMessagesActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";
import { publishMessage, PublishMessageParams } from "../actions/dbActions";

import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";

interface OwnProps {
  params: SemanticScreenRouteParams;
  messageId: string;
  isDraft: boolean;
  index: number;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  author: AuthorI;
  main?: string;
  displayPoint: PointI;
  referenceData?: PointReferenceI;
  isDragHovered: boolean;
  pointsAreSelected: boolean;
  setCurrentMessage: (params: SetCurrentMessageParams) => void;
  pointsMoveToMessage: (params: PointsMoveToMessageParams) => void;
  hoverOver: (params: HoverOverParams) => void;
  draftMessageDelete: (params: DraftMessageDeleteParams) => void;
  publishMessage: (params: PublishMessageParams) => void;
}

const MessageListItem = (props: AllProps) => {
  const { messageId: oldMessageId } = props.params;

  const history = useHistory();

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    drop: () => {
      if (props.isDraft) {
        props.pointsMoveToMessage({
          moveToMessageId: props.messageId,
          moveFromMessageId: oldMessageId,
          history,
        });
      }
    },
    hover: () => {
      if (!props.isDragHovered && props.isDraft) {
        props.hoverOver({
          region: "parking",
          index: props.index,
        });
      }
    },
  });

  const handleClick = () => {
    props.setCurrentMessage({
      oldMessageId,
      newAuthorId: props.author._id,
      newMessageId: props.messageId,
      history,
      oldMessageIsDraft: props.isDraft,
    });
  };

  const {
    isHovered,
    renderHamburger,
    renderHoverOptions,
    handleHamburgerMouseEnter,
    handlePointMouseEnter,
    handlePointMouseLeave,
  } = useHoverOptions();

  function handlePointsMoveButtonClick(e: React.MouseEvent) {
    props.pointsMoveToMessage({
      moveToMessageId: props.messageId,
      moveFromMessageId: props.params.messageId,
      history,
    });
    e.stopPropagation();
  }

  function handleTrashButtonClick(e: React.MouseEvent) {
    props.draftMessageDelete({
      messageId: props.messageId,
      currentMessageId: props.params.messageId,
      history,
    });
    e.stopPropagation();
  }

  function handlePublishButtonClick(e: React.MouseEvent) {
    if (!props.main) {
      window.alert(
        "Before publishing, please add a main point to your message"
      );
    } else {
      props.publishMessage({
        messageId: props.messageId,
        history,
      });
    }
    e.stopPropagation();
  }

  return (
    <MessageWrapper
      author={props.author}
      onMouseEnter={handlePointMouseEnter}
      onMouseLeave={handlePointMouseLeave}
      onClick={handleClick}
      isHovered={isHovered || props.isDragHovered}
      darkMode={props.darkMode}
      ref={drop}
    >
      <Point
        id={props.messageId}
        displayPoint={props.displayPoint}
        referenceData={props.referenceData}
        isMainPoint={true}
        isSelected={false}
        readOnlyOverride={true}
        darkMode={props.darkMode}
        suppressAutoFocus={true}
      >
        {renderHamburger && props.isDraft && (
          <Hamburger
            onMouseEnter={handleHamburgerMouseEnter}
            darkMode={props.darkMode}
          />
        )}
        {renderHoverOptions && props.isDraft && (
          <HoverContainer darkMode={props.darkMode}>
            {props.pointsAreSelected && (
              <PointsMoveButton
                handleClick={handlePointsMoveButtonClick}
                darkMode={props.darkMode}
              />
            )}
            <PublishButton
              handleClick={handlePublishButtonClick}
              darkMode={props.darkMode}
            />
            <TrashButton
              handleClick={handleTrashButtonClick}
              messageOrPoint="message"
              darkMode={props.darkMode}
            />
          </HoverContainer>
        )}
      </Point>
      <Banner
        authorId={props.author._id}
        placement={{ top: "-1rem", right: "0.5rem" }}
        fontSize="medium"
        isHovered={isHovered || props.isDragHovered}
        darkMode={props.darkMode}
      />
    </MessageWrapper>
  );
};

const MessageWrapper = styled.div<{
  author: AuthorI;
  isHovered: boolean;
  darkMode?: boolean;
}>`
  position: relative;
  border-radius: 3px;
  padding: 3px 1rem 3px 3px;

  ${(props) =>
    `
    border: 1.5px solid ${props.author.color};
    border-top: 0.5rem solid ${props.author.color}; 
  `}

  ${(props) =>
    props.isHovered &&
    `
    border-color: ${props.darkMode ? "white" : "black"};
  `}
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const message = getMessageById(ownProps.messageId, state);
  const author = isUserIdentity(message.author, state)
    ? state.userIdentities.byId[message.author]
    : state.authors.byId[message.author];

  // Display a point from the message if no main point exists
  const displayPointId =
    message.main ??
    Object.values(
      state.draftMessages.byId[ownProps.messageId].shapes
    ).flat()[0];
  const displayPoint = getPointIfReference(displayPointId, state);
  const referenceData = getReferenceData(displayPointId, state);

  let isDragHovered = false;
  if (
    state.drag.context &&
    state.drag.context.region === "parking" &&
    state.drag.context.index === ownProps.index &&
    ownProps.isDraft
  )
    isDragHovered = true;

  const pointsAreSelected = state.selectedPoints.pointIds.length !== 0;

  return {
    author,
    main: message.main,
    displayPoint,
    referenceData,
    isDragHovered,
    pointsAreSelected,
  };
};

const mapDispatchToProps = {
  setCurrentMessage,
  pointsMoveToMessage,
  hoverOver,
  draftMessageDelete,
  publishMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageListItem);
