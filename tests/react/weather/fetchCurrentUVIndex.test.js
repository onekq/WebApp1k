import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchCurrentUVIndex';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current UV index for a given location', async () => {
  fetchMock.get('/api/current-uv?location=NYC', { uvIndex: 5 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get UV Index')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('5')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current UV index if the API returns an error', async () => {
  fetchMock.get('/api/current-uv?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get UV Index')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching UV index')).toBeInTheDocument();
}, 10000);

