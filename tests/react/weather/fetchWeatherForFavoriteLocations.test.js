import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWeatherForFavoriteLocations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather for favorite locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { favoriteLocation: 'Paris', temperature: 18 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Favorite Locations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Paris: Temperature: 18')).toBeInTheDocument();
}, 10000);

test('Fetch weather for favorite locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Favorite Locations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Favorite locations not found')).toBeInTheDocument();
}, 10000);

