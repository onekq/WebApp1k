import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchCurrentPressure';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current atmospheric pressure for a given location', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { pressure: 1013 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1013 hPa')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current atmospheric pressure if the API returns an error', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching pressure')).toBeInTheDocument();
}, 10000);

