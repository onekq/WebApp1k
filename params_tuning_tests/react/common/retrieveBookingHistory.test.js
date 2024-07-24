import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import BookingHistoryComponent from './retrieveBookingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

