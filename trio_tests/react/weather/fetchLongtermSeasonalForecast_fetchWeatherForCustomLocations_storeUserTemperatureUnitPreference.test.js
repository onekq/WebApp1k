import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchLongtermSeasonalForecast_fetchWeatherForCustomLocations_storeUserTemperatureUnitPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Fetch weather for custom locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { customLocation: 'Mars', temperature: -60 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'Mars' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mars: Temperature: -60')).toBeInTheDocument();
}, 10000);

test('Fetch weather for custom locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'InvalidLocation' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Custom location not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user temperature unit preference', async () => {
  fetchMock.post('/preferences/temperature-unit', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('temperature-unit-select'), { target: { value: 'Celsius' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user temperature unit preference fails', async () => {
  fetchMock.post('/preferences/temperature-unit', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('temperature-unit-select'), { target: { value: 'Celsius' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
