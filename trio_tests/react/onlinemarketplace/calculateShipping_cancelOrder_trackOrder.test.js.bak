import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShipping_cancelOrder_trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('correctly calculates shipping based on location.', async () => {
  fetchMock.post('/api/shipping', { body: { cost: 15 } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Shipping cost: $15')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate shipping.', async () => {
  fetchMock.post('/api/shipping', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '54321' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();
}, 10000);

test('Cancel Order success removes order from list', async () => {
  fetchMock.delete('/api/orders/1', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(fetchMock.calls('/api/orders/1').length).toBe(1);
  expect(screen.queryByText('Order 1')).not.toBeInTheDocument();
}, 10000);

test('Cancel Order failure shows error message', async () => {
  fetchMock.delete('/api/orders/1', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(screen.getByText('Error cancelling order')).toBeInTheDocument();
}, 10000);

test('Track Order success displays tracking information', async () => {
  fetchMock.get('/api/orders/1/track', { status: 'In Transit' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls('/api/orders/1/track').length).toBe(1);
  expect(screen.getByText('In Transit')).toBeInTheDocument();
}, 10000);

test('Track Order failure shows error message', async () => {
  fetchMock.get('/api/orders/1/track', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(screen.getByText('Error tracking order')).toBeInTheDocument();
}, 10000);
