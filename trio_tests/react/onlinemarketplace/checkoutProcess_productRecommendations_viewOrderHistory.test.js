import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkoutProcess_productRecommendations_viewOrderHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('validates checkout steps successfully.', async () => {
  fetchMock.post('/api/checkout', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Proceed to Checkout')); });

  expect(fetchMock.calls('/api/checkout').length).toEqual(1);
  expect(screen.getByText('Checkout Completed')).toBeInTheDocument();
}, 10000);

test('displays error on checkout step failure.', async () => {
  fetchMock.post('/api/checkout', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Proceed to Checkout')); });

  expect(fetchMock.calls('/api/checkout').length).toEqual(1);
  expect(screen.getByText('Checkout failed')).toBeInTheDocument();
}, 10000);

test('Product Recommendations successfully displays recommended products.', async () => {
  fetchMock.get('/api/recommendations', { status: 200, body: { products: ['Recommended Product 1'] } });

  await act(async () => { render(<MemoryRouter><ProductRecommendations /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('recommend-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recommended Product 1')).toBeInTheDocument();
}, 10000);

test('Product Recommendations fails and displays error message.', async () => {
  fetchMock.get('/api/recommendations', { status: 500 });

  await act(async () => { render(<MemoryRouter><ProductRecommendations /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('recommend-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recommendations')).toBeInTheDocument();
}, 10000);

test('View Order History success shows order data', async () => {
  fetchMock.get('/api/orders', [{ id: 1, product: 'Product 1' }]);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  expect(fetchMock.calls('/api/orders').length).toBe(1);
  
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('View Order History failure shows error message', async () => {
  fetchMock.get('/api/orders', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  
  expect(screen.getByText('Error loading order history')).toBeInTheDocument();
}, 10000);
