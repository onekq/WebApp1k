import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeatherByGPSCoordinates_storeUserThemePreference_fetchAirQualityAlerts_storeUserTemperatureUnitPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather by GPS coordinates succeeds. (from fetchWeatherByGPSCoordinates_storeUserThemePreference)', async () => {
  fetchMock.post('/api/weather', { data: { lat: '40.7128', lon: '-74.0060', temperature: 22 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('lat-input'), { target: { value: '40.7128' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('lon-input'), { target: { value: '-74.0060' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 22')).toBeInTheDocument();
}, 10000);

test('Fetch weather by GPS coordinates fails. (from fetchWeatherByGPSCoordinates_storeUserThemePreference)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('lat-input'), { target: { value: 'InvalidLat' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('lon-input'), { target: { value: 'InvalidLon' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Coordinates not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user theme preference (from fetchWeatherByGPSCoordinates_storeUserThemePreference)', async () => {
  fetchMock.post('/preferences/theme', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user theme preference fails (from fetchWeatherByGPSCoordinates_storeUserThemePreference)', async () => {
  fetchMock.post('/preferences/theme', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts successfully retrieves air quality alerts (from fetchAirQualityAlerts_storeUserTemperatureUnitPreference)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Air Quality Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Air Quality Alert/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts fails to retrieve air quality alerts (from fetchAirQualityAlerts_storeUserTemperatureUnitPreference)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve air quality alerts/)).toBeInTheDocument();
}, 10000);

test('correctly stores user temperature unit preference (from fetchAirQualityAlerts_storeUserTemperatureUnitPreference)', async () => {
  fetchMock.post('/preferences/temperature-unit', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('temperature-unit-select'), { target: { value: 'Celsius' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user temperature unit preference fails (from fetchAirQualityAlerts_storeUserTemperatureUnitPreference)', async () => {
  fetchMock.post('/preferences/temperature-unit', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('temperature-unit-select'), { target: { value: 'Celsius' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

