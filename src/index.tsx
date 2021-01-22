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
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  useLocation,
  useHistory,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { store } from "./reducers";
import { connect, Provider } from "react-redux";

import { AppState } from "./reducers";
import { DBState } from "./reducers/db";
import { DisplayAppState } from "./reducers/displayApp";
import { DraftMessagesState } from "./reducers/draftMessages";
import { DraftPointsState } from "./reducers/draftPoints";

import { loadDatabase, LoadDatabaseParams } from "./actions/dbActions";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const mapStateToProps = (state: AppState) => {
  return {
    db: state.db,
    draftMessages: state.draftMessages,
    draftPoints: state.draftPoints,
    displayApp: state.displayApp,
  };
};

const mapDispatchToProps = {
  loadDatabase,
};

interface Props {
  db: DBState;
  draftMessages: DraftMessagesState;
  draftPoints: DraftPointsState;
  displayApp: DisplayAppState;
  loadDatabase: (params: LoadDatabaseParams) => void;
}

const AppWithPersistence = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ db, draftMessages, draftPoints, displayApp, loadDatabase }: Props) => {
  const { pathname } = useLocation();
  localStorage.setItem("pathname", pathname);

  useEffect(() => {
    const drafts = { draftMessages, draftPoints };
    localStorage.setItem("drafts", JSON.stringify(drafts));
  }, [draftMessages, draftPoints]);

  const history = useHistory();
  useEffect(() => {
    if (db?.loading) loadDatabase({ pathname, history });
  }, [db, history, pathname, loadDatabase]);

  if (!displayApp.display) return null;

  return <App />;
});

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <Router>
          <AppWithPersistence />
        </Router>
      </Provider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
