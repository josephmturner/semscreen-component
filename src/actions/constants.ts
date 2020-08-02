export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const Actions = {
  setCursorPosition: 'setCursorPosition',
  setEditingPoint: 'setEditingPoint',

  combinePoints: 'combinePoints',
  splitIntoTwoPoints: 'splitIntoTwoPoints',
}
