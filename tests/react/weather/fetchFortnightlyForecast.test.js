import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchFortnightlyForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchFortnightlyForecast - retrieves fortnightly forecast successfully', async () => {
  fetchMock.get('/api/fortnightly-forecast', {
    body: { forecast: 'Fortnightly: Mixed' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Fortnightly Forecast'));
  });

  expect(fetchMock.calls('/api/fortnightly-forecast').length).toBe(1);
  expect(screen.getByText('Fortnightly: Mixed')).toBeInTheDocument();
}, 10000);

test('FetchFortnightlyForecast - fails to retrieve fortnightly forecast', async () => {
  fetchMock.get('/api/fortnightly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Fortnightly Forecast'));
  });

  expect(fetchMock.calls('/api/fortnightly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);