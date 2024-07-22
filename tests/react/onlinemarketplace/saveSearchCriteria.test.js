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

test('Save Search Criteria successfully saves search criteria.', async () => {
  fetchMock.post('/api/saveSearch', { status: 200 });

  await act(async () => { render(<MemoryRouter><SaveSearchCriteria /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search criteria saved')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria fails and displays error message.', async () => {
  fetchMock.post('/api/saveSearch', { status: 500 });

  await act(async () => { render(<MemoryRouter><SaveSearchCriteria /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save search criteria')).toBeInTheDocument();
}, 10000);

