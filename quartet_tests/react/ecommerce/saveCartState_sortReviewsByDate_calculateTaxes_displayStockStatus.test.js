import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveCartState_sortReviewsByDate_calculateTaxes_displayStockStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('saveCartState: successfully save cart state for a logged-in user (from saveCartState_sortReviewsByDate)', async () => {
  fetchMock.post('/api/cart/save', { status: 200, body: { message: 'Saved' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cart state saved successfully')).toBeInTheDocument();  
}, 10000);

test('saveCartState: fail to save cart state with error message (from saveCartState_sortReviewsByDate)', async () => {
  fetchMock.post('/api/cart/save', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save cart state')).toBeInTheDocument();  
}, 10000);

test('Sorting reviews by newest date should display reviews in order (from saveCartState_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=newest', [{ id: 1, content: 'Recent review' }, { id: 2, content: 'Old review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="newest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=newest')).toHaveLength(1);
  expect(screen.getByText('Recent review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by oldest date should display reviews in order (from saveCartState_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=oldest', [{ id: 1, content: 'Old review' }, { id: 2, content: 'Recent review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=oldest')).toHaveLength(1);
  expect(screen.getByText('Old review')).toBeInTheDocument();
}, 10000);

test('calculateTaxes: successfully calculate taxes (from calculateTaxes_displayStockStatus)', async () => {
  fetchMock.get('/api/cart/taxes', { status: 200, body: { taxes: '8.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Taxes: $8.00')).toBeInTheDocument();  
}, 10000);

test('calculateTaxes: fail to calculate taxes with error message (from calculateTaxes_displayStockStatus)', async () => {
  fetchMock.get('/api/cart/taxes', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate taxes')).toBeInTheDocument();  
}, 10000);

test('displays product stock status successfully (from calculateTaxes_displayStockStatus)', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', stock: 'In Stock' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('In Stock')).toBeInTheDocument();
}, 10000);

test('fails to display product stock status and shows error (from calculateTaxes_displayStockStatus)', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

