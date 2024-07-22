import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './orderConfirmation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays order confirmation details correctly.', async () => {
  fetchMock.get('/api/order/confirmation', { body: { orderId: '12345' } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Order ID: 12345')).toBeInTheDocument();
}, 10000);

test('displays error on failing to fetch order confirmation.', async () => {
  fetchMock.get('/api/order/confirmation', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Failed to fetch order confirmation')).toBeInTheDocument();
}, 10000);

