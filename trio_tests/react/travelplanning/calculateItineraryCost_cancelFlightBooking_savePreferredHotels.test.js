import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateItineraryCost_cancelFlightBooking_savePreferredHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the total cost of the itinerary.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 200, body: { totalCost: 1000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('$1000')).toBeInTheDocument();
}, 10000);

test('fails to calculate cost due to server error.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

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

test('savePreferredHotels - saves preferred hotels to a wishlist successfully', async () => {
  fetchMock.post('/api/hotels/1/wishlist', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('save-wishlist-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel saved to wishlist')).toBeInTheDocument();
}, 10000);

test('savePreferredHotels - shows error message when saving to wishlist fails', async () => {
  fetchMock.post('/api/hotels/1/wishlist', {
    body: { message: 'Save Failed' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('save-wishlist-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Save Failed')).toBeInTheDocument();
}, 10000);
