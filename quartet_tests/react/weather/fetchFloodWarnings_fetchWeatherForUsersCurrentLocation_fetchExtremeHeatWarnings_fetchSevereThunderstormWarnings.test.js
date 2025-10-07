import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchFloodWarnings_fetchWeatherForUsersCurrentLocation_fetchExtremeHeatWarnings_fetchSevereThunderstormWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchFloodWarnings successfully retrieves flood warnings (from fetchFloodWarnings_fetchWeatherForUsersCurrentLocation)', async () => {
  fetchMock.getOnce('/api/flood-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Flood Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Flood Warning/)).toBeInTheDocument();
}, 10000);

test('fetchFloodWarnings fails to retrieve flood warnings (from fetchFloodWarnings_fetchWeatherForUsersCurrentLocation)', async () => {
  fetchMock.getOnce('/api/flood-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve flood warnings/)).toBeInTheDocument();
}, 10000);

test('fetchExtremeHeatWarnings successfully retrieves extreme heat warnings (from fetchExtremeHeatWarnings_fetchSevereThunderstormWarnings)', async () => {
  fetchMock.getOnce('/api/extreme-heat-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Extreme Heat Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Extreme Heat Warnings')); });

  expect(fetchMock.called('/api/extreme-heat-warnings')).toBeTruthy();
  expect(screen.getByText(/Extreme Heat Warning/)).toBeInTheDocument();
}, 10000);

test('fetchExtremeHeatWarnings fails to retrieve extreme heat warnings (from fetchExtremeHeatWarnings_fetchSevereThunderstormWarnings)', async () => {
  fetchMock.getOnce('/api/extreme-heat-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Extreme Heat Warnings')); });

  expect(fetchMock.called('/api/extreme-heat-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve extreme heat warnings/)).toBeInTheDocument();
}, 10000);

test('fetchSevereThunderstormWarnings successfully retrieves severe thunderstorm warnings (from fetchExtremeHeatWarnings_fetchSevereThunderstormWarnings)', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Severe Thunderstorm Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Severe Thunderstorm Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereThunderstormWarnings fails to retrieve severe thunderstorm warnings (from fetchExtremeHeatWarnings_fetchSevereThunderstormWarnings)', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe thunderstorm warnings/)).toBeInTheDocument();
}, 10000);

