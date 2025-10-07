import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchAirQualityAlerts_fetchCurrentDewPoint_storeUserForecastUpdateIntervalPreference_storeUserWindSpeedUnitPreference';

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

test('correctly stores user forecast update interval preference (from storeUserForecastUpdateIntervalPreference_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.post('/preferences/update-interval', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-interval-select'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user forecast update interval preference fails (from storeUserForecastUpdateIntervalPreference_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.post('/preferences/update-interval', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-interval-select'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('correctly stores user wind speed unit preference (from storeUserForecastUpdateIntervalPreference_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user wind speed unit preference fails (from storeUserForecastUpdateIntervalPreference_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

