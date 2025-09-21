import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetch48hourForecast_fetchCurrentPressure_fetchCurrentWindSpeed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Fetch48hourForecast - retrieves 48-hour forecast successfully', async () => {
  fetchMock.get('/api/48-hour-forecast', {
    body: { forecast: '48-Hour: Stormy' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get 48-Hour Forecast'));
  });

  expect(fetchMock.calls('/api/48-hour-forecast').length).toBe(1);
  expect(screen.getByText('48-Hour: Stormy')).toBeInTheDocument();
}, 10000);

test('Fetch48hourForecast - fails to retrieve 48-hour forecast', async () => {
  fetchMock.get('/api/48-hour-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get 48-Hour Forecast'));
  });

  expect(fetchMock.calls('/api/48-hour-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current atmospheric pressure for a given location', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { pressure: 1013 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1013 hPa')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current atmospheric pressure if the API returns an error', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching pressure')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current wind speed for a given location', async () => {
  fetchMock.get('/api/current-wind?location=NYC', { windSpeed: 10 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Wind Speed')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 mph')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current wind speed if the API returns an error', async () => {
  fetchMock.get('/api/current-wind?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Wind Speed')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching wind speed')).toBeInTheDocument();
}, 10000);
