import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkProductUpload_productAvailabilityNotification_orderConfirmation_sortProducts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Bulk product upload succeeds. (from bulkProductUpload_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/bulk-upload', { status: 200, body: { message: 'Bulk upload successful' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'sample.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Bulk upload successful')).toBeInTheDocument();
}, 10000);

test('Bulk product upload fails with error message. (from bulkProductUpload_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/bulk-upload', { status: 400, body: { message: 'Invalid file format' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'invalid_file.txt')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Invalid file format')).toBeInTheDocument();
}, 10000);

test('Product availability notification succeeds. (from bulkProductUpload_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message. (from bulkProductUpload_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('displays order confirmation details correctly. (from orderConfirmation_sortProducts)', async () => {
  fetchMock.get('/api/order/confirmation', { body: { orderId: '12345' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Order ID: 12345')).toBeInTheDocument();
}, 10000);

test('displays error on failing to fetch order confirmation. (from orderConfirmation_sortProducts)', async () => {
  fetchMock.get('/api/order/confirmation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Failed to fetch order confirmation')).toBeInTheDocument();
}, 10000);

test('Sort Products successfully sorts products. (from orderConfirmation_sortProducts)', async () => {
  fetchMock.get('/api/sort', { status: 200, body: { results: ['Product A', 'Product B'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
}, 10000);

test('Sort Products fails and displays error message. (from orderConfirmation_sortProducts)', async () => {
  fetchMock.get('/api/sort', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort products')).toBeInTheDocument();
}, 10000);

