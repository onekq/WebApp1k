import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchTornadoWarnings';

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

