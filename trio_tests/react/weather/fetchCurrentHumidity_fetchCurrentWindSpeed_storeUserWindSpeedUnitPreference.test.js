import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentHumidity_fetchCurrentWindSpeed_storeUserWindSpeedUnitPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully retrieves the current humidity for a given location', async () => {
  fetchMock.get('/api/current-humidity?location=NYC', { humidity: 65 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Humidity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('65%')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current humidity if the API returns an error', async () => {
  fetchMock.get('/api/current-humidity?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Humidity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching humidity')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current wind speed for a given location', async () => {
  fetchMock.get('/api/current-wind?location=NYC', { windSpeed: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Wind Speed')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 mph')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current wind speed if the API returns an error', async () => {
  fetchMock.get('/api/current-wind?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Wind Speed')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching wind speed')).toBeInTheDocument();
}, 10000);

test('correctly stores user wind speed unit preference', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user wind speed unit preference fails', async () => {
  fetchMock.post('/preferences/wind-speed-unit', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('wind-speed-unit-select'), { target: { value: 'km/h' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
