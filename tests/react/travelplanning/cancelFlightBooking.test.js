import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cancelFlightBooking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('CancelFlightBooking - cancel flight booking successfully', async () => {
  fetchMock.post('/api/cancel-booking', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Booking cancelled successfully')).toBeInTheDocument();
}, 10000);

test('CancelFlightBooking - cancel flight booking fails with error message', async () => {
  fetchMock.post('/api/cancel-booking', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to cancel booking')).toBeInTheDocument();
}, 10000);