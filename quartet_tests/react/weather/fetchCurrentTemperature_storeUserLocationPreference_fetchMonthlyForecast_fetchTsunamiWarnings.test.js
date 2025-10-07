import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentTemperature_storeUserLocationPreference_fetchMonthlyForecast_fetchTsunamiWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current temperature for a given location (from fetchCurrentTemperature_storeUserLocationPreference)', async () => {
  fetchMock.get('/api/current-temperature?location=NYC', { temperature: 75 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Temperature')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('75�F')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current temperature if the API returns an error (from fetchCurrentTemperature_storeUserLocationPreference)', async () => {
  fetchMock.get('/api/current-temperature?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Temperature')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching temperature')).toBeInTheDocument();
}, 10000);

test('correctly stores user location preference (from fetchCurrentTemperature_storeUserLocationPreference)', async () => {
  fetchMock.post('/preferences/location', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user location preference fails (from fetchCurrentTemperature_storeUserLocationPreference)', async () => {
  fetchMock.post('/preferences/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('FetchMonthlyForecast - retrieves monthly forecast successfully (from fetchMonthlyForecast_fetchTsunamiWarnings)', async () => {
  fetchMock.get('/api/monthly-forecast', {
    body: { forecast: 'Warm Month' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Monthly Forecast'));
  });

  expect(fetchMock.calls('/api/monthly-forecast').length).toBe(1);
  expect(screen.getByText('Warm Month')).toBeInTheDocument();
}, 10000);

test('FetchMonthlyForecast - fails to retrieve monthly forecast (from fetchMonthlyForecast_fetchTsunamiWarnings)', async () => {
  fetchMock.get('/api/monthly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Monthly Forecast'));
  });

  expect(fetchMock.calls('/api/monthly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings successfully retrieves tsunami warnings (from fetchMonthlyForecast_fetchTsunamiWarnings)', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tsunami Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Tsunami Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings fails to retrieve tsunami warnings (from fetchMonthlyForecast_fetchTsunamiWarnings)', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tsunami warnings/)).toBeInTheDocument();
}, 10000);

