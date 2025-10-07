import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productAvailabilityNotification_productListing_applyDiscountCode_auctionCountdown';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Product availability notification succeeds. (from productAvailabilityNotification_productListing)', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message. (from productAvailabilityNotification_productListing)', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('Product listing succeeds with required details. (from productAvailabilityNotification_productListing)', async () => {
  fetchMock.post('/api/products', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Sample Product' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Product listed successfully')).toBeInTheDocument();
}, 10000);

test('Product listing fails with missing details error. (from productAvailabilityNotification_productListing)', async () => {
  fetchMock.post('/api/products', { status: 400, body: { message: 'Missing required details' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Missing required details')).toBeInTheDocument();
}, 10000);

test('applies discount code successfully. (from applyDiscountCode_auctionCountdown)', async () => {
  fetchMock.post('/api/discount', { body: { discount: 10 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Discount applied: 10%')).toBeInTheDocument();
}, 10000);

test('displays error on invalid discount code. (from applyDiscountCode_auctionCountdown)', async () => {
  fetchMock.post('/api/discount', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('displays the auction countdown successfully. (from applyDiscountCode_auctionCountdown)', async () => {
  const mockTimerData = { time: '10:00:00' };
  fetchMock.get('/api/auction-timer', { status: 200, body: mockTimerData });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('auction-timer-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10:00:00')).toBeInTheDocument();
}, 10000);

test('fails to display the auction countdown with an error message. (from applyDiscountCode_auctionCountdown)', async () => {
  fetchMock.get('/api/auction-timer', { status: 400, body: { error: 'Failed to load timer' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('auction-timer-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load timer')).toBeInTheDocument();
}, 10000);

