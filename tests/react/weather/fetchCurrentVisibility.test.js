import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchCurrentVisibility';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current visibility distance for a given location', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { visibility: 10 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 miles')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current visibility distance if the API returns an error', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching visibility')).toBeInTheDocument();
}, 10000);

