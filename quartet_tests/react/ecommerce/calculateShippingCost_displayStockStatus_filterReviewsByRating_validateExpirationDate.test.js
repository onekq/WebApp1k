import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShippingCost_displayStockStatus_filterReviewsByRating_validateExpirationDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateShippingCost: successfully calculate shipping costs (from calculateShippingCost_displayStockStatus)', async () => {
  fetchMock.get('/api/cart/shipping', { status: 200, body: { shipping: '15.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping: $15.00')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: fail to calculate shipping costs with error message (from calculateShippingCost_displayStockStatus)', async () => {
  fetchMock.get('/api/cart/shipping', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();  
}, 10000);

test('displays product stock status successfully (from calculateShippingCost_displayStockStatus)', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', stock: 'In Stock' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('In Stock')).toBeInTheDocument();
}, 10000);

test('fails to display product stock status and shows error (from calculateShippingCost_displayStockStatus)', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Filtering reviews by rating should display correct reviews (from filterReviewsByRating_validateExpirationDate)', async () => {
  fetchMock.get('/api/reviews?rating=5', [{ id: 1, rating: 5, content: 'Great!' }]);

  await act(async () => { render(<MemoryRouter><App rating={5} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?rating=5')).toHaveLength(1);
  expect(screen.getByText('Great!')).toBeInTheDocument();
}, 10000);

test('Filtering reviews by rating should display no reviews for non-existent rating (from filterReviewsByRating_validateExpirationDate)', async () => {
  fetchMock.get('/api/reviews?rating=5', []);

  await act(async () => { render(<MemoryRouter><App rating={5} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?rating=5')).toHaveLength(1);
  expect(screen.getByText('No reviews for this rating')).toBeInTheDocument();
}, 10000);

test('valid expiration date (from filterReviewsByRating_validateExpirationDate)', async () => {
  fetchMock.post('/api/validate-expiration-date', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expiration-date-input'), { target: { value: '12/25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid expiration date (from filterReviewsByRating_validateExpirationDate)', async () => {
  fetchMock.post('/api/validate-expiration-date', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expiration-date-input'), { target: { value: '13/25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid expiration date')).toBeInTheDocument();
}, 10000);

