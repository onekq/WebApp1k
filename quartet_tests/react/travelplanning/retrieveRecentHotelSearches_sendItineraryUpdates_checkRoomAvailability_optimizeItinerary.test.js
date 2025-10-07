import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveRecentHotelSearches_sendItineraryUpdates_checkRoomAvailability_optimizeItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully (from retrieveRecentHotelSearches_sendItineraryUpdates)', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: [{ id: 4, name: 'Recent Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recent Hotel')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - shows error message when retrieval fails (from retrieveRecentHotelSearches_sendItineraryUpdates)', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: { message: 'Retrieval Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Retrieval Error')).toBeInTheDocument();
}, 10000);

test('successfully sends itinerary updates. (from retrieveRecentHotelSearches_sendItineraryUpdates)', async () => {
  fetchMock.post('/api/send-updates', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Updates sent')).toBeInTheDocument();
}, 10000);

test('fails to send updates due to invalid email. (from retrieveRecentHotelSearches_sendItineraryUpdates)', async () => {
  fetchMock.post('/api/send-updates', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('checkRoomAvailability - checks room availability for selected hotels (from checkRoomAvailability_optimizeItinerary)', async () => {
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

test('checkRoomAvailability - shows error message when room availability check fails (from checkRoomAvailability_optimizeItinerary)', async () => {
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

test('successfully optimizes itinerary for travel time and convenience. (from checkRoomAvailability_optimizeItinerary)', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary optimized')).toBeInTheDocument();
}, 10000);

test('fails to optimize itinerary due to server error. (from checkRoomAvailability_optimizeItinerary)', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

