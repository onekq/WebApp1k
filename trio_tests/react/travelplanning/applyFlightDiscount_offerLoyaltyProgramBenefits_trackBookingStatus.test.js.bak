import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyFlightDiscount_offerLoyaltyProgramBenefits_trackBookingStatus';

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

test('should render loyalty program benefits and reward points', async () => {
  fetchMock.get('/api/loyalty', { benefits: ['Double Points', 'Free Upgrades'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter loyalty program'), { target: { value: 'Frequent Flyer' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Benefits')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Double Points')).toBeInTheDocument();
}, 10000);

test('should show error if fetching loyalty program benefits fails', async () => {
  fetchMock.get('/api/loyalty', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter loyalty program'), { target: { value: 'Frequent Flyer' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Benefits')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
}, 10000);

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
