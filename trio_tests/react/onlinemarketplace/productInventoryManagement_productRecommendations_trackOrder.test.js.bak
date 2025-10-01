import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productInventoryManagement_productRecommendations_trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Inventory management for sellers succeeds.', async () => {
  fetchMock.get('/api/seller/inventory', { status: 200, body: [{ id: 1, name: 'Sample Product', stock: 15 }] });

  await act(async () => { render(<MemoryRouter><InventoryManagement /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Inventory management fails with error message.', async () => {
  fetchMock.get('/api/seller/inventory', { status: 500, body: { message: 'Internal server error' } });

  await act(async () => { render(<MemoryRouter><InventoryManagement /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Internal server error')).toBeInTheDocument();
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
