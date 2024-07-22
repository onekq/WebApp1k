import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './provideWeatherUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should provide weather updates successfully.', async () => {
  fetchMock.get('/api/weather/updates', { status: 200, body: { weather: 'sunny' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Weather: sunny')).toBeInTheDocument();
}, 10000);

test('should fail to provide weather updates.', async () => {
  fetchMock.get('/api/weather/updates', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Failed to fetch weather updates.')).toBeInTheDocument();
}, 10000);

