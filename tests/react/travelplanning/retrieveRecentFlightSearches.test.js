import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveRecentFlightSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('RetrieveRecentFlightSearches - retrieve recent flight searches successfully', async () => {
  fetchMock.get('/api/recent-searches', {
    searches: [{ id: 1, origin: 'SFO', destination: 'NYC' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recent Searches')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SFO to NYC')).toBeInTheDocument();
}, 10000);

test('RetrieveRecentFlightSearches - retrieve recent flight search fails with error message', async () => {
  fetchMock.get('/api/recent-searches', { throws: new Error('Failed to retrieve recent searches') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recent Searches')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to retrieve recent searches')).toBeInTheDocument();
}, 10000);
