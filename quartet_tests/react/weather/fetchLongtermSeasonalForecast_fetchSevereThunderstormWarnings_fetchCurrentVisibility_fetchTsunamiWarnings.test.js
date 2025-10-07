import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchLongtermSeasonalForecast_fetchSevereThunderstormWarnings_fetchCurrentVisibility_fetchTsunamiWarnings';

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

test('Successfully retrieves the current visibility distance for a given location (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { visibility: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 miles')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current visibility distance if the API returns an error (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching visibility')).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings successfully retrieves tsunami warnings (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tsunami Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Tsunami Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings fails to retrieve tsunami warnings (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tsunami warnings/)).toBeInTheDocument();
}, 10000);

