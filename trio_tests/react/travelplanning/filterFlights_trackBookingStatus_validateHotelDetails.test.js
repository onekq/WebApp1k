import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterFlights_trackBookingStatus_validateHotelDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('FilterFlights - filter flights by price successfully', async () => {
  fetchMock.get('/api/flights?filter=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('FilterFlights - filter flights by price fails with error message', async () => {
  fetchMock.get('/api/flights?filter=price', { throws: new Error('Failed to filter flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter flights')).toBeInTheDocument();
}, 10000);

test('Booking status should be tracked and shown to users.', async () => {
  fetchMock.get('/api/booking/status', { status: 'Confirmed' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-status')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('booking-status')).toBeInTheDocument();
}, 10000);

test('Error in tracking booking status should show error message.', async () => {
  fetchMock.get('/api/booking/status', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-status')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);

test('validateHotelDetails - validates hotel details successfully before booking', async () => {
  fetchMock.get('/api/hotels/1/details', {
    body: { id: 1, name: 'Checked Hotel' },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('validate-hotel-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Checked Hotel')).toBeInTheDocument();
}, 10000);

test('validateHotelDetails - shows error when validation fails', async () => {
  fetchMock.get('/api/hotels/1/details', {
    body: { message: 'Validation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('validate-hotel-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation Error')).toBeInTheDocument();
}, 10000);
