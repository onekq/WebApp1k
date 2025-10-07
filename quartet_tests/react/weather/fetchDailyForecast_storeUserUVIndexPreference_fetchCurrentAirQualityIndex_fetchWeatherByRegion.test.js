import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchDailyForecast_storeUserUVIndexPreference_fetchCurrentAirQualityIndex_fetchWeatherByRegion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Successfully retrieves the current air quality index for a given location (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { aqi: 42 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('42')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current air quality index if the API returns an error (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching AQI')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region succeeds. (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.post('/api/weather', { data: { region: 'Midwest', temperature: 25 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'Midwest' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region fails. (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'InvalidRegion' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Region not found')).toBeInTheDocument();
}, 10000);

