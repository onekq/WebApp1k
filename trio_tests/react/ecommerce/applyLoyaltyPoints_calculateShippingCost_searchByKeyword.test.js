import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyLoyaltyPoints_calculateShippingCost_searchByKeyword';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Applies loyalty points successfully', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Loyalty points applied successfully')).toBeInTheDocument();
}, 10000);

test('Fails to apply loyalty points', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply loyalty points')).toBeInTheDocument();
}, 10000);

test('calculateShippingCost: successfully calculate shipping costs', async () => {
  fetchMock.get('/api/cart/shipping', { status: 200, body: { shipping: '15.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping: $15.00')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: fail to calculate shipping costs with error message', async () => {
  fetchMock.get('/api/cart/shipping', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();  
}, 10000);

test('searches by keyword successfully', async () => {
  fetchMock.get('/api/products?search=phone', { products: [{ id: 1, name: 'Smartphone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'phone' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=phone')).toBe(true);
  expect(screen.getByText('Smartphone')).toBeInTheDocument();
}, 10000);

test('fails to search by keyword and shows error', async () => {
  fetchMock.get('/api/products?search=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);
