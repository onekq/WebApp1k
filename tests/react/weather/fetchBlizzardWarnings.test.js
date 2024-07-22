import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchBlizzardWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchBlizzardWarnings successfully retrieves blizzard warnings', async () => {
  fetchMock.getOnce('/api/blizzard-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Blizzard Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Blizzard Warnings')); });

  expect(fetchMock.called('/api/blizzard-warnings')).toBeTruthy();
  expect(screen.getByText(/Blizzard Warning/)).toBeInTheDocument();
}, 10000);

test('fetchBlizzardWarnings fails to retrieve blizzard warnings', async () => {
  fetchMock.getOnce('/api/blizzard-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Blizzard Warnings')); });

  expect(fetchMock.called('/api/blizzard-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve blizzard warnings/)).toBeInTheDocument();
}, 10000);

