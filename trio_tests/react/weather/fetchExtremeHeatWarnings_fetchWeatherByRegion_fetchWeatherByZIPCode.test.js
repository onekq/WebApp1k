import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchExtremeHeatWarnings_fetchWeatherByRegion_fetchWeatherByZIPCode';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Fetch weather by region succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { region: 'Midwest', temperature: 25 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'Midwest' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'InvalidRegion' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Region not found')).toBeInTheDocument();
}, 10000);

test('Fetch weather by ZIP code succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { zip: '10001', temperature: 15 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('zip-input'), { target: { value: '10001' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 15')).toBeInTheDocument();
}, 10000);

test('Fetch weather by ZIP code fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('zip-input'), { target: { value: '00000' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('ZIP code not found')).toBeInTheDocument();
}, 10000);
