import { ActionTypes } from './actions';

export const initialState: any = Object.freeze({
  locale: 'de-DE',
});

export default (state: any = initialState, action: any): any => {
  const { type, payload = {} } = action;

  switch (type) {
    case ActionTypes.SETLOCALE: {
      return {
        ...state,
        locale: payload,
      };
    }
  }

  return state;
};
