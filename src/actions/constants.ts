export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const Actions = {
  setCursorPosition: 'setCursorPosition',
  setEditingPoint: 'setEditingPoint',

  pointCreate: 'pointCreate',
  pointUpdate: 'pointUpdate',
  pointMove: 'pointMove',
  pointsDelete: 'pointsDelete',
  setFocus: 'setFocus',
  setMainPoint: 'setMainPoint',
  combinePoints: 'combinePoints',
  splitIntoTwoPoints: 'splitIntoTwoPoints',
}
