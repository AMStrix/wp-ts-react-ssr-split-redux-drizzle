import { createSelector } from 'reselect';

export const app = (state: any): any => state.app;

export const getLocale = createSelector([app], (a): any => a.locale);
