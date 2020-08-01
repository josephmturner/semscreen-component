import { SetEditingPointAction } from "../actions";

export interface EditingPointState {
  editingPointId: string;
}

const initialEditingPointState: EditingPointState = {
  editingPointId: "",
};

export const editingPointReducer = (
  state = initialEditingPointState,
  action: SetEditingPointAction
): EditingPointState => {
  return {
    editingPointId: action.pointId,
  };
};
