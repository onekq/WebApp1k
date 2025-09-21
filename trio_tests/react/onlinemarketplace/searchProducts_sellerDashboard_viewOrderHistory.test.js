import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchProducts_sellerDashboard_viewOrderHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Search Products successfully displays relevant results.', async () => {
  fetchMock.get('/api/search', { status: 200, body: { results: ['Product 1', 'Product 2'] } });

  await act(async () => { render(<MemoryRouter><SearchProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'query' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('Search Products fails and displays error message.', async () => {
  fetchMock.get('/api/search', { status: 500 });

  await act(async () => { render(<MemoryRouter><SearchProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'query' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
}, 10000);

test('successfully displays the seller dashboard.', async () => {
  const mockDashboardData = { 
    dashboardInfo: 'Some dashboard information' 
  };
  fetchMock.get('/api/seller-dashboard', { status: 200, body: mockDashboardData });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('dashboard-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Some dashboard information')).toBeInTheDocument();
}, 10000);

test('fails to display the seller dashboard with an error message.', async () => {
  fetchMock.get('/api/seller-dashboard', { status: 400, body: { error: 'Failed to load dashboard' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('dashboard-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load dashboard')).toBeInTheDocument();
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
