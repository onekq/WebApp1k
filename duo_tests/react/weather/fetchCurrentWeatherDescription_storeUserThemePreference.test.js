import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentWeatherDescription_storeUserThemePreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves a description of current weather conditions', async () => {
  fetchMock.get('/api/current-description?location=NYC', { description: 'Sunny' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve a description of current weather conditions if the API returns an error', async () => {
  fetchMock.get('/api/current-description?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching weather description')).toBeInTheDocument();
}, 10000);

test('correctly stores user theme preference', async () => {
  fetchMock.post('/preferences/theme', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user theme preference fails', async () => {
  fetchMock.post('/preferences/theme', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);