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
import React, { useMemo, useEffect, useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { createStore } from "../reducers/store";
import { MessageState } from "../reducers/message";
import { setMessage } from "../actions/messageActions";
import { setSelectedPoints } from "../actions/selectPointActions";

import SemanticScreenLogic from "./SemanticScreenLogic";

const SemanticScreen = (props: {
  message?: MessageState;
  onChangeMessage?: (message: MessageState) => void;
  selectedPointIds?: string[];
  onChangeSelectedPointIds?: (pointIds: string[]) => void;
  readOnly?: boolean;
  darkMode?: boolean;
}) => {
  const {
    message,
    onChangeMessage,
    selectedPointIds,
    onChangeSelectedPointIds,
  } = props;

  const store = useMemo(createStore, []);

  useLayoutEffect(() => {
    if (message && message !== store.getState().message) {
      store.dispatch(setMessage({ message: message }));
    }
    if (
      selectedPointIds &&
      selectedPointIds !== store.getState().selectedPoints.pointIds
    ) {
      store.dispatch(setSelectedPoints({ pointIds: selectedPointIds }));
    }
  }, [store, message, selectedPointIds]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (onChangeMessage && store.getState().message !== message) {
        onChangeMessage(store.getState().message);
      }
      if (
        onChangeSelectedPointIds &&
        store.getState().selectedPoints.pointIds !== selectedPointIds
      ) {
        onChangeSelectedPointIds(store.getState().selectedPoints.pointIds);
      }
    });
    return () => unsubscribe();
  }, [
    store,
    onChangeMessage,
    message,
    onChangeSelectedPointIds,
    selectedPointIds,
  ]);

  return (
    <Provider store={store}>
      <SemanticScreenLogic
        readOnly={props.readOnly || false}
        darkMode={props.darkMode || false}
      />
    </Provider>
  );
};

export default SemanticScreen;
