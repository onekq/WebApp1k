import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchNextDayForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchNextDayForecast - retrieves next-day forecast successfully', async () => {
  fetchMock.get('/api/next-day-forecast', {
    body: { forecast: 'Next Day: Cloudy' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Next Day Forecast'));
  });

  expect(fetchMock.calls('/api/next-day-forecast').length).toBe(1);
  expect(screen.getByText('Next Day: Cloudy')).toBeInTheDocument();
}, 10000);

test('FetchNextDayForecast - fails to retrieve next-day forecast', async () => {
  fetchMock.get('/api/next-day-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Next Day Forecast'));
  });

  expect(fetchMock.calls('/api/next-day-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);
