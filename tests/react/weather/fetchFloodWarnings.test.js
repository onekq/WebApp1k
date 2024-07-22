import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchFloodWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchFloodWarnings successfully retrieves flood warnings', async () => {
  fetchMock.getOnce('/api/flood-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Flood Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Flood Warning/)).toBeInTheDocument();
}, 10000);

test('fetchFloodWarnings fails to retrieve flood warnings', async () => {
  fetchMock.getOnce('/api/flood-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Flood Warnings')); });

  expect(fetchMock.called('/api/flood-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve flood warnings/)).toBeInTheDocument();
}, 10000);

