import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentWindSpeed_storeUserForecastUpdateIntervalPreference_fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current wind speed for a given location (from fetchCurrentWindSpeed_storeUserForecastUpdateIntervalPreference)', async () => {
  fetchMock.get('/api/current-wind?location=NYC', { windSpeed: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Wind Speed')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 mph')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current wind speed if the API returns an error (from fetchCurrentWindSpeed_storeUserForecastUpdateIntervalPreference)', async () => {
  fetchMock.get('/api/current-wind?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Wind Speed')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching wind speed')).toBeInTheDocument();
}, 10000);

test('correctly stores user forecast update interval preference (from fetchCurrentWindSpeed_storeUserForecastUpdateIntervalPreference)', async () => {
  fetchMock.post('/preferences/update-interval', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-interval-select'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user forecast update interval preference fails (from fetchCurrentWindSpeed_storeUserForecastUpdateIntervalPreference)', async () => {
  fetchMock.post('/preferences/update-interval', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-interval-select'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

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

