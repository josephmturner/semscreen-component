import { Action, Actions } from "./constants";
import { AuthorI } from "../dataModels/dataModels";

export interface SetAuthorsParams {
  authors: AuthorI[];
}

export const setAuthors = (
  params: SetAuthorsParams
): Action<SetAuthorsParams> => {
  return {
    type: Actions.setAuthors,
    params,
  };
};
