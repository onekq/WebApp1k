import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeatherForCustomLocations_fetchWeekendForecast_fetchHourlyForecast_storeUserTemperatureUnitPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather for custom locations succeeds. (from fetchWeatherForCustomLocations_fetchWeekendForecast)', async () => {
  fetchMock.post('/api/weather', { data: { customLocation: 'Mars', temperature: -60 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'Mars' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mars: Temperature: -60')).toBeInTheDocument();
}, 10000);

test('Fetch weather for custom locations fails. (from fetchWeatherForCustomLocations_fetchWeekendForecast)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'InvalidLocation' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Custom location not found')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - retrieves weekend forecast successfully (from fetchWeatherForCustomLocations_fetchWeekendForecast)', async () => {
  fetchMock.get('/api/weekend-forecast', {
    body: { forecast: 'Weekend: Sunny' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekend Forecast'));
  });

  expect(fetchMock.calls('/api/weekend-forecast').length).toBe(1);
  expect(screen.getByText('Weekend: Sunny')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - fails to retrieve weekend forecast (from fetchWeatherForCustomLocations_fetchWeekendForecast)', async () => {
  fetchMock.get('/api/weekend-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekend Forecast'));
  });

  expect(fetchMock.calls('/api/weekend-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('FetchHourlyForecast - retrieves hourly forecast successfully (from fetchHourlyForecast_storeUserTemperatureUnitPreference)', async () => {
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

test('FetchHourlyForecast - fails to retrieve hourly forecast (from fetchHourlyForecast_storeUserTemperatureUnitPreference)', async () => {
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

test('correctly stores user temperature unit preference (from fetchHourlyForecast_storeUserTemperatureUnitPreference)', async () => {
  fetchMock.post('/preferences/temperature-unit', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('temperature-unit-select'), { target: { value: 'Celsius' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user temperature unit preference fails (from fetchHourlyForecast_storeUserTemperatureUnitPreference)', async () => {
  fetchMock.post('/preferences/temperature-unit', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('temperature-unit-select'), { target: { value: 'Celsius' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

