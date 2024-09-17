import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchMonthlyForecast_fetchTsunamiWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchMonthlyForecast - retrieves monthly forecast successfully', async () => {
  fetchMock.get('/api/monthly-forecast', {
    body: { forecast: 'Warm Month' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Monthly Forecast'));
  });

  expect(fetchMock.calls('/api/monthly-forecast').length).toBe(1);
  expect(screen.getByText('Warm Month')).toBeInTheDocument();
}, 10000);

test('FetchMonthlyForecast - fails to retrieve monthly forecast', async () => {
  fetchMock.get('/api/monthly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Monthly Forecast'));
  });

  expect(fetchMock.calls('/api/monthly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings successfully retrieves tsunami warnings', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tsunami Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Tsunami Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings fails to retrieve tsunami warnings', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tsunami warnings/)).toBeInTheDocument();
}, 10000);