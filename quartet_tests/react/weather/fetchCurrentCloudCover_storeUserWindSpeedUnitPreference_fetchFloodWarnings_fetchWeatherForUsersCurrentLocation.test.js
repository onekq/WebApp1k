import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentCloudCover_storeUserWindSpeedUnitPreference_fetchFloodWarnings_fetchWeatherForUsersCurrentLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current cloud cover percentage for a given location (from fetchCurrentCloudCover_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.get('/api/current-clouds?location=NYC', { cloudCover: 45 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Cloud Cover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('45%')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current cloud cover percentage if the API returns an error (from fetchCurrentCloudCover_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.get('/api/current-clouds?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Cloud Cover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching cloud cover')).toBeInTheDocument();
}, 10000);

test('correctly stores user wind speed unit preference (from fetchCurrentCloudCover_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user wind speed unit preference fails (from fetchCurrentCloudCover_storeUserWindSpeedUnitPreference)', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('fetchFloodWarnings successfully retrieves flood warnings (from fetchFloodWarnings_fetchWeatherForUsersCurrentLocation)', async () => {
  fetchMock.getOnce('/api/flood-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Flood Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Flood Warning/)).toBeInTheDocument();
}, 10000);

test('fetchFloodWarnings fails to retrieve flood warnings (from fetchFloodWarnings_fetchWeatherForUsersCurrentLocation)', async () => {
  fetchMock.getOnce('/api/flood-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve flood warnings/)).toBeInTheDocument();
}, 10000);

