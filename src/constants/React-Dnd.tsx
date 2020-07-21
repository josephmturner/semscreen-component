import { PointI, PointShape } from "../constants/AppState";

export const ItemTypes = {
  POINT: "point",
};

export interface DraggablePointType {
  type: "point";
  pointId: PointI["pointId"];
  shape: PointShape;
  index: number;
}
