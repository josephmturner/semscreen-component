import React from "react";
import { initialAppState } from './constants/initialState';
import SemanticScreen from "./components/SemanticScreen";

const message = initialAppState.messages[0];

const App = () => (
  <SemanticScreen message={ message } />
);

export default App;
