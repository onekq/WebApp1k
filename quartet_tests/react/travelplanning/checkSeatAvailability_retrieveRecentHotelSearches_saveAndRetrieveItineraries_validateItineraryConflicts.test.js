import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkSeatAvailability_retrieveRecentHotelSearches_saveAndRetrieveItineraries_validateItineraryConflicts';

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

test('successfully saves an itinerary to user profile. (from saveAndRetrieveItineraries_validateItineraryConflicts)', async () => {
  fetchMock.post('/api/save-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-itinerary-button')); });

  expect(fetchMock.calls('/api/save-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary saved')).toBeInTheDocument();
}, 10000);

test('fails to save itinerary due to a server error. (from saveAndRetrieveItineraries_validateItineraryConflicts)', async () => {
  fetchMock.post('/api/save-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-itinerary-button')); });

  expect(fetchMock.calls('/api/save-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('successfully validates itinerary conflicts. (from saveAndRetrieveItineraries_validateItineraryConflicts)', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 200, body: { conflicts: [] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('No conflicts')).toBeInTheDocument();
}, 10000);

test('fails to validate itinerary conflicts due to conflicts. (from saveAndRetrieveItineraries_validateItineraryConflicts)', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 400, body: { conflicts: ['Conflict1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('Conflict1')).toBeInTheDocument();
}, 10000);

