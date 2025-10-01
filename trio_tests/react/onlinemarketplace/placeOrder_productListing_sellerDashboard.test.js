import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './placeOrder_productListing_sellerDashboard';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('places an order successfully.', async () => {
  fetchMock.post('/api/order', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on failing to place order.', async () => {
  fetchMock.post('/api/order', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placement failed')).toBeInTheDocument();
}, 10000);

test('Product listing succeeds with required details.', async () => {
  fetchMock.post('/api/products', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Sample Product' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Product listed successfully')).toBeInTheDocument();
}, 10000);

test('Product listing fails with missing details error.', async () => {
  fetchMock.post('/api/products', { status: 400, body: { message: 'Missing required details' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Missing required details')).toBeInTheDocument();
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
