import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchHurricaneWarnings_fetchNextDayForecast_fetchWildfireAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchHurricaneWarnings successfully retrieves hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Hurricane Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Hurricane Warning/)).toBeInTheDocument();
}, 10000);

test('fetchHurricaneWarnings fails to retrieve hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve hurricane warnings/)).toBeInTheDocument();
}, 10000);

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

test('fetchWildfireAlerts successfully retrieves wildfire alerts', async () => {
  fetchMock.getOnce('/api/wildfire-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Wildfire Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Wildfire Alerts')); });

  expect(fetchMock.called('/api/wildfire-alerts')).toBeTruthy();
  expect(screen.getByText(/Wildfire Alert/)).toBeInTheDocument();
}, 10000);

test('fetchWildfireAlerts fails to retrieve wildfire alerts', async () => {
  fetchMock.getOnce('/api/wildfire-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Wildfire Alerts')); });

  expect(fetchMock.called('/api/wildfire-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve wildfire alerts/)).toBeInTheDocument();
}, 10000);
