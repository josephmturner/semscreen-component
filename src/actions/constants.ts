export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const Actions = {
  setCursorPosition: "setCursorPosition",
  clearCursorPosition: "clearCursorPosition",

  setMessage: "setMessage",
  pointCreate: "pointCreate",
  pointUpdate: "pointUpdate",
  pointMove: "pointMove",
  pointsDelete: "pointsDelete",
  setFocus: "setFocus",
  setMainPoint: "setMainPoint",
  combinePoints: "combinePoints",
  splitIntoTwoPoints: "splitIntoTwoPoints",

  setExpandedRegion: "setExpandedRegion",

  setSelectedPoints: "setSelectedPoints",
  togglePoint: "togglePoint",
  selectAllPoints: "selectAllPoints",
  deselectAllPoints: "deselectAllPoints",
};
