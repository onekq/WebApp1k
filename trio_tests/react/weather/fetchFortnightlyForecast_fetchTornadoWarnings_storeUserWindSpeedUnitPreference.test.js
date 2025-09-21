import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchFortnightlyForecast_fetchTornadoWarnings_storeUserWindSpeedUnitPreference';

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

test('fetchTornadoWarnings successfully retrieves tornado warnings', async () => {
  fetchMock.getOnce('/api/tornado-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tornado Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tornado Warnings')); });

  expect(fetchMock.called('/api/tornado-warnings')).toBeTruthy();
  expect(screen.getByText(/Tornado Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTornadoWarnings fails to retrieve tornado warnings', async () => {
  fetchMock.getOnce('/api/tornado-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tornado Warnings')); });

  expect(fetchMock.called('/api/tornado-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tornado warnings/)).toBeInTheDocument();
}, 10000);

test('correctly stores user wind speed unit preference', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 200);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user wind speed unit preference fails', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 500);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
