import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkSeatAvailability_validatePaymentInformation_cancelHotelBooking_recommendTransportationOptions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('CheckSeatAvailability - check seat availability successfully (from checkSeatAvailability_validatePaymentInformation)', async () => {
  fetchMock.get('/api/seat-availability', { available: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are available')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability fails with error message (from checkSeatAvailability_validatePaymentInformation)', async () => {
  fetchMock.get('/api/seat-availability', { available: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are not available')).toBeInTheDocument();
}, 10000);

test('Valid payment information should be processed successfully. (from checkSeatAvailability_validatePaymentInformation)', async () => {
  fetchMock.post('/api/payment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('card-number'), { target: { value: '1234567890123456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-payment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Invalid payment information should show error message. (from checkSeatAvailability_validatePaymentInformation)', async () => {
  fetchMock.post('/api/payment', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('card-number'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-payment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('cancelHotelBooking - cancels hotel booking and processes refund calculation (from cancelHotelBooking_recommendTransportationOptions)', async () => {
  fetchMock.post('/api/hotels/1/cancel', {
    body: { refund: 100 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('cancel-booking-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund: $100')).toBeInTheDocument();
}, 10000);

test('cancelHotelBooking - shows error message when cancellation fails (from cancelHotelBooking_recommendTransportationOptions)', async () => {
  fetchMock.post('/api/hotels/1/cancel', {
    body: { message: 'Cancellation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('cancel-booking-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cancellation Error')).toBeInTheDocument();
}, 10000);

test('should render recommended transportation options at the destination (from cancelHotelBooking_recommendTransportationOptions)', async () => {
  fetchMock.get('/api/transportation', { transportation: ['Rental Car', 'Metro'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rental Car')).toBeInTheDocument();
}, 10000);

test('should show error if fetching transportation options fails (from cancelHotelBooking_recommendTransportationOptions)', async () => {
  fetchMock.get('/api/transportation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load transportation options')).toBeInTheDocument();
}, 10000);

