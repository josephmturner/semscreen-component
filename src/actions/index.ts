export interface SetEditingPointAction {
  type: "SetEditingPoint";
  pointId: string;
}

export const setEditingPoint = (pointId: string): SetEditingPointAction => {
  return {
    type: "SetEditingPoint",
    pointId: pointId,
  };
};
