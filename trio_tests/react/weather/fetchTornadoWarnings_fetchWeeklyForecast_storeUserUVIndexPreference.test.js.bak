import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchTornadoWarnings_fetchWeeklyForecast_storeUserUVIndexPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchTornadoWarnings successfully retrieves tornado warnings', async () => {
  fetchMock.getOnce('/api/tornado-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tornado Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tornado Warnings')); });

  expect(fetchMock.called('/api/tornado-warnings')).toBeTruthy();
  expect(screen.getByText(/Tornado Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTornadoWarnings fails to retrieve tornado warnings', async () => {
  fetchMock.getOnce('/api/tornado-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tornado Warnings')); });

  expect(fetchMock.called('/api/tornado-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tornado warnings/)).toBeInTheDocument();
}, 10000);

test('FetchWeeklyForecast - retrieves weekly forecast successfully', async () => {
  fetchMock.get('/api/weekly-forecast', {
    body: { forecast: 'Rainy Week' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekly Forecast'));
  });

  expect(fetchMock.calls('/api/weekly-forecast').length).toBe(1);
  expect(screen.getByText('Rainy Week')).toBeInTheDocument();
}, 10000);

test('FetchWeeklyForecast - fails to retrieve weekly forecast', async () => {
  fetchMock.get('/api/weekly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekly Forecast'));
  });

  expect(fetchMock.calls('/api/weekly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('correctly stores user UV index preference', async () => {
  fetchMock.post('/preferences/uv-index', 200);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('uv-index-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user UV index preference fails', async () => {
  fetchMock.post('/preferences/uv-index', 500);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('uv-index-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
