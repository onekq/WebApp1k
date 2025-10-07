import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchExtremeHeatWarnings_fetchHourlyForecast_storeUserForecastUpdateIntervalPreference_storeUserSevereWeatherAlertPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchExtremeHeatWarnings successfully retrieves extreme heat warnings (from fetchExtremeHeatWarnings_fetchHourlyForecast)', async () => {
  fetchMock.getOnce('/api/extreme-heat-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Extreme Heat Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Extreme Heat Warnings')); });

  expect(fetchMock.called('/api/extreme-heat-warnings')).toBeTruthy();
  expect(screen.getByText(/Extreme Heat Warning/)).toBeInTheDocument();
}, 10000);

test('fetchExtremeHeatWarnings fails to retrieve extreme heat warnings (from fetchExtremeHeatWarnings_fetchHourlyForecast)', async () => {
  fetchMock.getOnce('/api/extreme-heat-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Extreme Heat Warnings')); });

  expect(fetchMock.called('/api/extreme-heat-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve extreme heat warnings/)).toBeInTheDocument();
}, 10000);

test('FetchHourlyForecast - retrieves hourly forecast successfully (from fetchExtremeHeatWarnings_fetchHourlyForecast)', async () => {
  fetchMock.get('/api/hourly-forecast', {
    body: { forecast: 'Sunny' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Hourly Forecast'));
  });

  expect(fetchMock.calls('/api/hourly-forecast').length).toBe(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('FetchHourlyForecast - fails to retrieve hourly forecast (from fetchExtremeHeatWarnings_fetchHourlyForecast)', async () => {
  fetchMock.get('/api/hourly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Hourly Forecast'));
  });

  expect(fetchMock.calls('/api/hourly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('correctly stores user forecast update interval preference (from storeUserForecastUpdateIntervalPreference_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.post('/preferences/update-interval', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-interval-select'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user forecast update interval preference fails (from storeUserForecastUpdateIntervalPreference_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.post('/preferences/update-interval', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-interval-select'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('correctly stores user severe weather alert preference (from storeUserForecastUpdateIntervalPreference_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.post('/preferences/weather-alerts', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user severe weather alert preference fails (from storeUserForecastUpdateIntervalPreference_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.post('/preferences/weather-alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

