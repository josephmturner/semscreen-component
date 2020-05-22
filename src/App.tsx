import React from "react";
import { messages } from './constants/initialState';
import Rim from "./components/Rim";

const message = messages[0];
let showShapes = true;

const App = () => (
  <Rim message={ message } showShapes={ showShapes } />
);

export default App;
