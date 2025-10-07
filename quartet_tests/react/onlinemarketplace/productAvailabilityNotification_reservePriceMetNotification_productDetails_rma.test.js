import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productAvailabilityNotification_reservePriceMetNotification_productDetails_rma';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Product availability notification succeeds. (from productAvailabilityNotification_reservePriceMetNotification)', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message. (from productAvailabilityNotification_reservePriceMetNotification)', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('successfully notifies user when reserve price is met. (from productAvailabilityNotification_reservePriceMetNotification)', async () => {
  fetchMock.get('/api/reserve-price', { status: 200, body: { message: 'Reserve price met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price met')).toBeInTheDocument();
}, 10000);

test('fails to notify user when reserve price is not met. (from productAvailabilityNotification_reservePriceMetNotification)', async () => {
  fetchMock.get('/api/reserve-price', { status: 400, body: { error: 'Reserve price not met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price not met')).toBeInTheDocument();
}, 10000);

test('Product details retrieval and display succeed. (from productDetails_rma)', async () => {
  fetchMock.get('/api/products/1', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Product details retrieval fails with error message. (from productDetails_rma)', async () => {
  fetchMock.get('/api/products/1', { status: 404, body: { message: 'Product not found' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Return Merchandise Authorization (RMA) success initiates RMA process (from productDetails_rma)', async () => {
  fetchMock.post('/api/orders/1/rma', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(fetchMock.calls('/api/orders/1/rma').length).toBe(1);
  expect(screen.getByText('RMA initiated')).toBeInTheDocument();
}, 10000);

test('Return Merchandise Authorization (RMA) failure shows error message (from productDetails_rma)', async () => {
  fetchMock.post('/api/orders/1/rma', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(screen.getByText('Error initiating RMA')).toBeInTheDocument();
}, 10000);

