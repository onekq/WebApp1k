import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings_fetchSevereWeatherAlerts_fetchWeatherForMultipleLocations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchLongtermSeasonalForecast - retrieves long-term seasonal forecast successfully (from fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings)', async () => {
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

test('FetchLongtermSeasonalForecast - fails to retrieve long-term seasonal forecast (from fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings)', async () => {
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

test('fetchSevereThunderstormWarnings successfully retrieves severe thunderstorm warnings (from fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings)', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Severe Thunderstorm Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Severe Thunderstorm Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereThunderstormWarnings fails to retrieve severe thunderstorm warnings (from fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings)', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe thunderstorm warnings/)).toBeInTheDocument();
}, 10000);

test('fetchSevereWeatherAlerts successfully retrieves alerts (from fetchSevereWeatherAlerts_fetchWeatherForMultipleLocations)', async () => {
  fetchMock.getOnce('/api/severe-weather-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Tornado Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Alerts')); });

  expect(fetchMock.called('/api/severe-weather-alerts')).toBeTruthy();
  expect(screen.getByText(/Tornado Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereWeatherAlerts fails to retrieve alerts (from fetchSevereWeatherAlerts_fetchWeatherForMultipleLocations)', async () => {
  fetchMock.getOnce('/api/severe-weather-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Alerts')); });

  expect(fetchMock.called('/api/severe-weather-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe weather alerts/)).toBeInTheDocument();
}, 10000);

test('Fetch weather for multiple locations succeeds. (from fetchSevereWeatherAlerts_fetchWeatherForMultipleLocations)', async () => {
  fetchMock.post('/api/weather', { data: [{ location: 'New York', temperature: 20 }, { location: 'Los Angeles', temperature: 25 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('locations-input'), { target: { value: 'New York, Los Angeles' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New York: Temperature: 20')).toBeInTheDocument();
  expect(screen.getByText('Los Angeles: Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather for multiple locations fails. (from fetchSevereWeatherAlerts_fetchWeatherForMultipleLocations)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('locations-input'), { target: { value: 'InvalidLocation1, InvalidLocation2' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Locations not found')).toBeInTheDocument();
}, 10000);

