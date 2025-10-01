import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentPressure_fetchWeatherForSpecificLandmark_storeUserLanguagePreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully retrieves the current atmospheric pressure for a given location', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { pressure: 1013 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1013 hPa')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current atmospheric pressure if the API returns an error', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching pressure')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { landmark: 'Eiffel Tower', temperature: 18 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'Eiffel Tower' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 18')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'InvalidLandmark' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Landmark not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user language preference', async () => {
  fetchMock.post('/preferences/language', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('language-select'), { target: { value: 'English' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user language preference fails', async () => {
  fetchMock.post('/preferences/language', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('language-select'), { target: { value: 'English' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
