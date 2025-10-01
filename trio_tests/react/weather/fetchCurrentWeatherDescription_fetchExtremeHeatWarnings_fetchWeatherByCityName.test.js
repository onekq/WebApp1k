import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentWeatherDescription_fetchExtremeHeatWarnings_fetchWeatherByCityName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully retrieves a description of current weather conditions', async () => {
  fetchMock.get('/api/current-description?location=NYC', { description: 'Sunny' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve a description of current weather conditions if the API returns an error', async () => {
  fetchMock.get('/api/current-description?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching weather description')).toBeInTheDocument();
}, 10000);

test('fetchExtremeHeatWarnings successfully retrieves extreme heat warnings', async () => {
  fetchMock.getOnce('/api/extreme-heat-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Extreme Heat Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Extreme Heat Warnings')); });

  expect(fetchMock.called('/api/extreme-heat-warnings')).toBeTruthy();
  expect(screen.getByText(/Extreme Heat Warning/)).toBeInTheDocument();
}, 10000);

test('fetchExtremeHeatWarnings fails to retrieve extreme heat warnings', async () => {
  fetchMock.getOnce('/api/extreme-heat-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Extreme Heat Warnings')); });

  expect(fetchMock.called('/api/extreme-heat-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve extreme heat warnings/)).toBeInTheDocument();
}, 10000);

test('Fetch weather by city name succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { city: 'New York', temperature: 20 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 20')).toBeInTheDocument();
}, 10000);

test('Fetch weather by city name fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'InvalidCity' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('City not found')).toBeInTheDocument();
}, 10000);
