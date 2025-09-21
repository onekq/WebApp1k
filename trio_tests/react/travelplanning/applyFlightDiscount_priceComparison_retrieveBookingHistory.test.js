import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyFlightDiscount_priceComparison_retrieveBookingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('ApplyFlightDiscount - apply discount code successfully', async () => {
  fetchMock.post('/api/apply-discount', { discountedCost: 180 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Discount Code'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Discounted Cost: 180')).toBeInTheDocument();
}, 10000);

test('ApplyFlightDiscount - apply discount code fails with error message', async () => {
  fetchMock.post('/api/apply-discount', { throws: new Error('Invalid discount code') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Discount Code'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('Price comparison should be provided for valid search.', async () => {
  fetchMock.post('/api/price/comparison', { price: 100 });

  await act(async () => { render(<MemoryRouter><PriceComparisonComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-prices')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('price-comparison')).toBeInTheDocument();
}, 10000);

test('Error in providing price comparison should show error message.', async () => {
  fetchMock.post('/api/price/comparison', 500);

  await act(async () => { render(<MemoryRouter><PriceComparisonComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-prices')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comparison-error')).toBeInTheDocument();
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
