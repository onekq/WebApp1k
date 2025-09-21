import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cancelHotelBooking_handleBookingModifications_retrieveRecentHotelSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('cancelHotelBooking - cancels hotel booking and processes refund calculation', async () => {
  fetchMock.post('/api/hotels/1/cancel', {
    body: { refund: 100 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('cancel-booking-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund: $100')).toBeInTheDocument();
}, 10000);

test('cancelHotelBooking - shows error message when cancellation fails', async () => {
  fetchMock.post('/api/hotels/1/cancel', {
    body: { message: 'Cancellation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('cancel-booking-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cancellation Error')).toBeInTheDocument();
}, 10000);

test('Booking should be modified successfully for valid request.', async () => {
  fetchMock.put('/api/booking/modify', 200);

  await act(async () => { render(<MemoryRouter><BookingModificationComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-success')).toBeInTheDocument();
}, 10000);

test('Error in booking modification should show error message.', async () => {
  fetchMock.put('/api/booking/modify', 400);

  await act(async () => { render(<MemoryRouter><BookingModificationComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-error')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: [{ id: 4, name: 'Recent Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recent Hotel')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - shows error message when retrieval fails', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: { message: 'Retrieval Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Retrieval Error')).toBeInTheDocument();
}, 10000);
