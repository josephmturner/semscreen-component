//TODO: remove tag cloud and also simplify what data needs to be
//provided to lower-level components  
//do we need to import React as well?
import { useReducer } from 'react';

const initialRimState: RimState = {
  className: 'passive',
  regionActive: 'none',
  cloud: false,
  isEditing: false,
};

interface RimState {
  className?: string;
  regionActive?: string;
  cloud?: boolean;
  isEditing?: boolean;
}

interface Actions {
  type: string;
  regionActive?: string;
  className?: string;
  cloud?: boolean;
  isEditing?: boolean;
}

function reducer(state: RimState, action: Actions) {
  switch (action.type) {
    case 'activate':
      return {
        ...state,
        regionActive: action.regionActive,
        className: action.className,
        cloud: action.cloud,
      };
    case 'deactivate':
      return {
        ...state,
        regionActive: action.regionActive,
        className: action.className,
        cloud: false,
      };
    case 'set_editing':
      return {
        ...state,
        isEditing: action.isEditing,
      };
    default:
      return state;
  }
}

type SetIsEditingI = (value: boolean) => void;

type ToggleRegionState = (region: string, cloud?: boolean) => void;

type UseRimI = {
  state: RimState;
  setIsEditing: SetIsEditingI;
  toggleRegionState: ToggleRegionState;
};

export default function useRim(): UseRimI {
  const [state, dispatch] = useReducer(reducer, initialRimState);

  const toggleRegionState: ToggleRegionState = (region, cloud) => {
    if (state.regionActive === region) {
      dispatch({
        type: 'deactivate',
        regionActive: 'none',
        className: 'passive',
      });
    } else {
      dispatch({
        type: 'activate',
        regionActive: region,
        className: `${region}--active`,
        cloud,
      });
    }
  };

  const setIsEditing: SetIsEditingI = value => {
    dispatch({
      type: 'set_editing',
      isEditing: value,
    });
  };

  return {
    state,
    setIsEditing,
    toggleRegionState,
  };
}
