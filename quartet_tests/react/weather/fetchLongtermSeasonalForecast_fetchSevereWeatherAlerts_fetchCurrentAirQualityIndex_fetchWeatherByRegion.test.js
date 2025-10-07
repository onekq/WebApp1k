import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchLongtermSeasonalForecast_fetchSevereWeatherAlerts_fetchCurrentAirQualityIndex_fetchWeatherByRegion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchLongtermSeasonalForecast - retrieves long-term seasonal forecast successfully (from fetchLongtermSeasonalForecast_fetchSevereWeatherAlerts)', async () => {
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

test('FetchLongtermSeasonalForecast - fails to retrieve long-term seasonal forecast (from fetchLongtermSeasonalForecast_fetchSevereWeatherAlerts)', async () => {
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

test('fetchSevereWeatherAlerts successfully retrieves alerts (from fetchLongtermSeasonalForecast_fetchSevereWeatherAlerts)', async () => {
  fetchMock.getOnce('/api/severe-weather-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Tornado Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Alerts')); });

  expect(fetchMock.called('/api/severe-weather-alerts')).toBeTruthy();
  expect(screen.getByText(/Tornado Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereWeatherAlerts fails to retrieve alerts (from fetchLongtermSeasonalForecast_fetchSevereWeatherAlerts)', async () => {
  fetchMock.getOnce('/api/severe-weather-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Alerts')); });

  expect(fetchMock.called('/api/severe-weather-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe weather alerts/)).toBeInTheDocument();
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

