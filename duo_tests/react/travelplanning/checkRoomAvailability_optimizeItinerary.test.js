import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkRoomAvailability_optimizeItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('checkRoomAvailability - checks room availability for selected hotels', async () => {
  fetchMock.get('/api/hotels/1/rooms?dates=2023-01-01_to_2023-01-10', {
    body: { available: true },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('check-availability-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Available')).toBeInTheDocument();
}, 10000);

test('checkRoomAvailability - shows error message when room availability check fails', async () => {
  fetchMock.get('/api/hotels/1/rooms?dates=2023-01-01_to_2023-01-10', {
    body: { available: false, message: 'No rooms available' },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('check-availability-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No rooms available')).toBeInTheDocument();
}, 10000);

test('successfully optimizes itinerary for travel time and convenience.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary optimized')).toBeInTheDocument();
}, 10000);

test('fails to optimize itinerary due to server error.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);