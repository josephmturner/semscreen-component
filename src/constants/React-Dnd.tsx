import { PointI, PointShape } from "../dataModels";

export const ItemTypes = {
  POINT: "point",
};

export interface DraggablePointType {
  type: "point";
  pointId: PointI["pointId"];
  shape: PointShape;
  index: number;
  originalShape: PointShape;
  originalIndex: number;
  quoted: boolean;
}
