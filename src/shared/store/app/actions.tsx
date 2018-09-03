export const ActionTypes = {
  SETLOCALE: 'app/set-locale',
};

export const setLocale = (locale: string) => ({
  type: ActionTypes.SETLOCALE,
  payload: locale,
});
