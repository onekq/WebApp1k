import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchDailyForecast_storeUserAirQualityIndexPreference_storeUserLocationPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('FetchDailyForecast - retrieves daily forecast successfully', async () => {
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

test('FetchDailyForecast - fails to retrieve daily forecast', async () => {
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

test('correctly stores user air quality index preference', async () => {
  fetchMock.post('/preferences/air-quality-index', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('air-quality-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user air quality index preference fails', async () => {
  fetchMock.post('/preferences/air-quality-index', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('air-quality-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('correctly stores user location preference', async () => {
  fetchMock.post('/preferences/location', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user location preference fails', async () => {
  fetchMock.post('/preferences/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
