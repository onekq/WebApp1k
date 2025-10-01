import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './optimizeItinerary_retrieveBookingHistory_sendItineraryUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully optimizes itinerary for travel time and convenience.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary optimized')).toBeInTheDocument();
}, 10000);

test('fails to optimize itinerary due to server error.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('Booking history should be retrieved and displayed for valid request.', async () => {
  fetchMock.get('/api/booking/history', [{ id: 1, status: 'Confirmed' }]);

  await act(async () => { render(<MemoryRouter><BookingHistoryComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-history')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('booking-history')).toBeInTheDocument();
}, 10000);

test('Error in retrieving booking history should show error message.', async () => {
  fetchMock.get('/api/booking/history', 500);

  await act(async () => { render(<MemoryRouter><BookingHistoryComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-history')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('history-error')).toBeInTheDocument();
}, 10000);

test('successfully sends itinerary updates.', async () => {
  fetchMock.post('/api/send-updates', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Updates sent')).toBeInTheDocument();
}, 10000);

test('fails to send updates due to invalid email.', async () => {
  fetchMock.post('/api/send-updates', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);
