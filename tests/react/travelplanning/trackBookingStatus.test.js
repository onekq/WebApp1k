import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import BookingStatusComponent from './trackBookingStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Booking status should be tracked and shown to users.', async () => {
  fetchMock.get('/api/booking/status', { status: 'Confirmed' });

  await act(async () => { render(<MemoryRouter><BookingStatusComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-status')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('booking-status')).toBeInTheDocument();
}, 10000);

test('Error in tracking booking status should show error message.', async () => {
  fetchMock.get('/api/booking/status', 404);

  await act(async () => { render(<MemoryRouter><BookingStatusComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-status')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);

