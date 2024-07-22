import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchCurrentDewPoint';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current dew point for a given location', async () => {
  fetchMock.get('/api/current-dew?location=NYC', { dewPoint: 60 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Dew Point')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('60�F')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current dew point if the API returns an error', async () => {
  fetchMock.get('/api/current-dew?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Dew Point')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching dew point')).toBeInTheDocument();
}, 10000);

