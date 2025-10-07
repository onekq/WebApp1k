import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cancelHotelBooking_recommendTransportationOptions_applyLoyaltyPoints_calculateFlightCost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Loyalty points should be calculated and applied for valid bookings. (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/loyalty', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-success')).toBeInTheDocument();
}, 10000);

test('Error in applying loyalty points should show error message. (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/loyalty', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-error')).toBeInTheDocument();
}, 10000);

test('CalculateFlightCost - calculate total flight cost successfully (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/calculate-cost', { cost: 250 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Cost: 250')).toBeInTheDocument();
}, 10000);

test('CalculateFlightCost - calculate total flight cost fails with error message (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/calculate-cost', { throws: new Error('Failed to calculate flight cost') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate flight cost')).toBeInTheDocument();
}, 10000);

