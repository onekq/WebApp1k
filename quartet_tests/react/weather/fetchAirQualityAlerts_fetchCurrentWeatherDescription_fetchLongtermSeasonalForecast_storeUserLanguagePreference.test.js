import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchAirQualityAlerts_fetchCurrentWeatherDescription_fetchLongtermSeasonalForecast_storeUserLanguagePreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchAirQualityAlerts successfully retrieves air quality alerts (from fetchAirQualityAlerts_fetchCurrentWeatherDescription)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Air Quality Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Air Quality Alert/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts fails to retrieve air quality alerts (from fetchAirQualityAlerts_fetchCurrentWeatherDescription)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve air quality alerts/)).toBeInTheDocument();
}, 10000);

test('Successfully retrieves a description of current weather conditions (from fetchAirQualityAlerts_fetchCurrentWeatherDescription)', async () => {
  fetchMock.get('/api/current-description?location=NYC', { description: 'Sunny' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve a description of current weather conditions if the API returns an error (from fetchAirQualityAlerts_fetchCurrentWeatherDescription)', async () => {
  fetchMock.get('/api/current-description?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching weather description')).toBeInTheDocument();
}, 10000);

test('FetchLongtermSeasonalForecast - retrieves long-term seasonal forecast successfully (from fetchLongtermSeasonalForecast_storeUserLanguagePreference)', async () => {
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

test('FetchLongtermSeasonalForecast - fails to retrieve long-term seasonal forecast (from fetchLongtermSeasonalForecast_storeUserLanguagePreference)', async () => {
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

test('correctly stores user language preference (from fetchLongtermSeasonalForecast_storeUserLanguagePreference)', async () => {
  fetchMock.post('/preferences/language', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('language-select'), { target: { value: 'English' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user language preference fails (from fetchLongtermSeasonalForecast_storeUserLanguagePreference)', async () => {
  fetchMock.post('/preferences/language', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('language-select'), { target: { value: 'English' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

