import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchFloodWarnings_fetchLongtermSeasonalForecast_fetchWeatherForUsersCurrentLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchFloodWarnings successfully retrieves flood warnings', async () => {
  fetchMock.getOnce('/api/flood-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Flood Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Flood Warning/)).toBeInTheDocument();
}, 10000);

test('fetchFloodWarnings fails to retrieve flood warnings', async () => {
  fetchMock.getOnce('/api/flood-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve flood warnings/)).toBeInTheDocument();
}, 10000);

test('FetchLongtermSeasonalForecast - retrieves long-term seasonal forecast successfully', async () => {
  fetchMock.get('/api/seasonal-forecast', {
    body: { forecast: 'Cold Season' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Seasonal Forecast'));
  });

  expect(fetchMock.calls('/api/seasonal-forecast').length).toBe(1);
  expect(screen.getByText('Cold Season')).toBeInTheDocument();
}, 10000);

test('FetchLongtermSeasonalForecast - fails to retrieve long-term seasonal forecast', async () => {
  fetchMock.get('/api/seasonal-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Seasonal Forecast'));
  });

  expect(fetchMock.calls('/api/seasonal-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { location: 'Current Location', temperature: 30 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 30')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Current location not found')).toBeInTheDocument();
}, 10000);
