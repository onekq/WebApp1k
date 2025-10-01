import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeatherForFavoriteLocations_fetchWeatherForUsersCurrentLocation_storeUserNotificationSettings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Fetch weather for favorite locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { favoriteLocation: 'Paris', temperature: 18 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Favorite Locations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Paris: Temperature: 18')).toBeInTheDocument();
}, 10000);

test('Fetch weather for favorite locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Favorite Locations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Favorite locations not found')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { location: 'Current Location', temperature: 30 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 30')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Current location not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user notification settings', async () => {
  fetchMock.post('/preferences/notifications', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notifications-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user notification settings fails', async () => {
  fetchMock.post('/preferences/notifications', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notifications-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
