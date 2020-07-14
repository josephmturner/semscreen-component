import { PointI } from "../constants/AppState";

export const ItemTypes = {
 POINT: 'point',
}

export interface DraggablePointType {
  type: 'point',
  point: PointI,
  index: number,
}
