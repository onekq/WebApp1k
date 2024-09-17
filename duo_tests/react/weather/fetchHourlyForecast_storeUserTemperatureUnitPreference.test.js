import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchHourlyForecast_storeUserTemperatureUnitPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchHourlyForecast - retrieves hourly forecast successfully', async () => {
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

test('FetchHourlyForecast - fails to retrieve hourly forecast', async () => {
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