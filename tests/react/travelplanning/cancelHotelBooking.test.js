import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './cancelHotelBooking';

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