import React from "react";
import { messages } from './constants/initialState';
import SemanticScreen from "./components/SemanticScreen";

const message = messages[0];

const App = () => (
  <SemanticScreen message={ message } />
);

export default App;
