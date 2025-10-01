import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchFloodWarnings_fetchHurricaneWarnings_fetchWeeklyForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchFloodWarnings successfully retrieves flood warnings', async () => {
  fetchMock.getOnce('/api/flood-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Flood Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Flood Warning/)).toBeInTheDocument();
}, 10000);

test('fetchFloodWarnings fails to retrieve flood warnings', async () => {
  fetchMock.getOnce('/api/flood-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve flood warnings/)).toBeInTheDocument();
}, 10000);

test('fetchHurricaneWarnings successfully retrieves hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Hurricane Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Hurricane Warning/)).toBeInTheDocument();
}, 10000);

test('fetchHurricaneWarnings fails to retrieve hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve hurricane warnings/)).toBeInTheDocument();
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
