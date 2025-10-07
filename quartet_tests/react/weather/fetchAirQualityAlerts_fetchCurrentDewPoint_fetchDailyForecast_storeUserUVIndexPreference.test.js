import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchAirQualityAlerts_fetchCurrentDewPoint_fetchDailyForecast_storeUserUVIndexPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchAirQualityAlerts successfully retrieves air quality alerts (from fetchAirQualityAlerts_fetchCurrentDewPoint)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Air Quality Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Air Quality Alert/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts fails to retrieve air quality alerts (from fetchAirQualityAlerts_fetchCurrentDewPoint)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve air quality alerts/)).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current dew point for a given location (from fetchAirQualityAlerts_fetchCurrentDewPoint)', async () => {
  fetchMock.get('/api/current-dew?location=NYC', { dewPoint: 60 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Dew Point')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('60�F')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current dew point if the API returns an error (from fetchAirQualityAlerts_fetchCurrentDewPoint)', async () => {
  fetchMock.get('/api/current-dew?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Dew Point')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching dew point')).toBeInTheDocument();
}, 10000);

test('FetchDailyForecast - retrieves daily forecast successfully (from fetchDailyForecast_storeUserUVIndexPreference)', async () => {
  fetchMock.get('/api/daily-forecast', {
    body: { forecast: 'Partly Cloudy' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Daily Forecast'));
  });

  expect(fetchMock.calls('/api/daily-forecast').length).toBe(1);
  expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
}, 10000);

test('FetchDailyForecast - fails to retrieve daily forecast (from fetchDailyForecast_storeUserUVIndexPreference)', async () => {
  fetchMock.get('/api/daily-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Daily Forecast'));
  });

  expect(fetchMock.calls('/api/daily-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('correctly stores user UV index preference (from fetchDailyForecast_storeUserUVIndexPreference)', async () => {
  fetchMock.post('/preferences/uv-index', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('uv-index-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user UV index preference fails (from fetchDailyForecast_storeUserUVIndexPreference)', async () => {
  fetchMock.post('/preferences/uv-index', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('uv-index-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

