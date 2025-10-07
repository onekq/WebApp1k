import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './biddingOnProducts_productAvailabilityNotification_filterProducts_reservePriceMetNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully places a bid on a product. (from biddingOnProducts_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/bid', { status: 200, body: { success: 'Bid placed successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('bid-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('bid-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bid placed successfully')).toBeInTheDocument();
}, 10000);

test('fails to place a bid on a product with an error message displayed. (from biddingOnProducts_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/bid', { status: 400, body: { error: 'Failed to place bid' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('bid-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('bid-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to place bid')).toBeInTheDocument();
}, 10000);

test('Product availability notification succeeds. (from biddingOnProducts_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message. (from biddingOnProducts_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('Filter Products successfully filters products. (from filterProducts_reservePriceMetNotification)', async () => {
  fetchMock.get('/api/filter', { status: 200, body: { results: ['Filtered Product 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Filtered Product 1')).toBeInTheDocument();
}, 10000);

test('Filter Products fails and displays error message. (from filterProducts_reservePriceMetNotification)', async () => {
  fetchMock.get('/api/filter', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to apply filters')).toBeInTheDocument();
}, 10000);

test('successfully notifies user when reserve price is met. (from filterProducts_reservePriceMetNotification)', async () => {
  fetchMock.get('/api/reserve-price', { status: 200, body: { message: 'Reserve price met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price met')).toBeInTheDocument();
}, 10000);

test('fails to notify user when reserve price is not met. (from filterProducts_reservePriceMetNotification)', async () => {
  fetchMock.get('/api/reserve-price', { status: 400, body: { error: 'Reserve price not met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price not met')).toBeInTheDocument();
}, 10000);

