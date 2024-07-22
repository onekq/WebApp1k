import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchHurricaneWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchHurricaneWarnings successfully retrieves hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Hurricane Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Hurricane Warning/)).toBeInTheDocument();
}, 10000);

test('fetchHurricaneWarnings fails to retrieve hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve hurricane warnings/)).toBeInTheDocument();
}, 10000);

