import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkSeatAvailability_retrieveRecentHotelSearches_optimizeItinerary_recommendTransportationOptions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('CheckSeatAvailability - check seat availability successfully (from checkSeatAvailability_retrieveRecentHotelSearches)', async () => {
  fetchMock.get('/api/seat-availability', { available: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are available')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability fails with error message (from checkSeatAvailability_retrieveRecentHotelSearches)', async () => {
  fetchMock.get('/api/seat-availability', { available: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are not available')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully (from checkSeatAvailability_retrieveRecentHotelSearches)', async () => {
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

test('retrieveRecentHotelSearches - shows error message when retrieval fails (from checkSeatAvailability_retrieveRecentHotelSearches)', async () => {
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

test('successfully optimizes itinerary for travel time and convenience. (from optimizeItinerary_recommendTransportationOptions)', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary optimized')).toBeInTheDocument();
}, 10000);

test('fails to optimize itinerary due to server error. (from optimizeItinerary_recommendTransportationOptions)', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('should render recommended transportation options at the destination (from optimizeItinerary_recommendTransportationOptions)', async () => {
  fetchMock.get('/api/transportation', { transportation: ['Rental Car', 'Metro'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rental Car')).toBeInTheDocument();
}, 10000);

test('should show error if fetching transportation options fails (from optimizeItinerary_recommendTransportationOptions)', async () => {
  fetchMock.get('/api/transportation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load transportation options')).toBeInTheDocument();
}, 10000);

