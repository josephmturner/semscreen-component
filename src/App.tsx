import React from "react";
import { initialAppState } from './constants/initialState';
import SemanticScreen from "./components/SemanticScreen";

const semscreen = initialAppState.semscreens[0];

const App = () => (
  <SemanticScreen semscreen={semscreen} />
);

export default App;
