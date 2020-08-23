export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const Actions = {
  setCursorPosition: "setCursorPosition",
  setEditingPoint: "setEditingPoint",

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
};
