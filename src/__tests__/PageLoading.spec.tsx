import * as React from 'react';
import { shallow } from 'enzyme';

import PageLoading, { DEFAULT_LOADING } from '../shared/components/PageLoading';

it('should render with default loading text', () => {
  const pageLoading = shallow(<PageLoading />);
  expect(pageLoading.length).toBe(1);
  expect(pageLoading.find('span').text()).toEqual(DEFAULT_LOADING);
});

it('should render with custom loading text', () => {
  const pageLoading = shallow(<PageLoading message="Hold up!" />);
  expect(pageLoading.length).toBe(1);
  expect(pageLoading.find('span').text()).toEqual('Hold up!');
});
