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
import { Route, Switch } from "react-router-dom";

import { SemanticScreen } from "./components/SemanticScreen";

const darkMode = true;
const App = () => (
  <Switch>
    <Route path="/u/:authorId/m/:messageId">
      <SemanticScreen darkMode={darkMode} />
    </Route>
    <Route path="/u/:authorId/d/:messageId">
      <SemanticScreen isDraft={true} darkMode={darkMode} />
    </Route>
    <Route path="/">
      <div>You shouldn't see this page</div>
    </Route>
  </Switch>
);

export default App;
