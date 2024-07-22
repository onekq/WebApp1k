import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SaveSearchCriteria from './saveSearchCriteria';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully saves search criteria', async () => {
  fetchMock.post('/api/search/save', 200);

  await act(async () => { render(<MemoryRouter><SaveSearchCriteria /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-criteria'), { target: { value: '2BHK' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('save-success')).toBeInTheDocument();
}, 10000);

test('fails to save search criteria and shows error message', async () => {
  fetchMock.post('/api/search/save', 500);

  await act(async () => { render(<MemoryRouter><SaveSearchCriteria /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-criteria'), { target: { value: '2BHK' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('save-error')).toBeInTheDocument();
}, 10000);

