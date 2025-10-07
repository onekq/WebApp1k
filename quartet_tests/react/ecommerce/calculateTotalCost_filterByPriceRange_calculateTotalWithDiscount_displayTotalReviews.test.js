import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalCost_filterByPriceRange_calculateTotalWithDiscount_displayTotalReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTotalCost: successfully display total cost including all charges (from calculateTotalCost_filterByPriceRange)', async () => {
  fetchMock.get('/api/cart/total', { status: 200, body: { total: '123.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total: $123.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalCost: fail to display total cost with error message (from calculateTotalCost_filterByPriceRange)', async () => {
  fetchMock.get('/api/cart/total', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total cost')).toBeInTheDocument();  
}, 10000);

test('filters by price range successfully (from calculateTotalCost_filterByPriceRange)', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', { products: [{ id: 1, name: 'Laptop' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Laptop')).toBeInTheDocument();
}, 10000);

test('fails to filter by price range and shows error (from calculateTotalCost_filterByPriceRange)', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

test('calculateTotalWithDiscount: successfully calculate total with discount applied (from calculateTotalWithDiscount_displayTotalReviews)', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 200, body: { total: '80.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total after discount: $80.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalWithDiscount: fail to calculate total with discount applied with error message (from calculateTotalWithDiscount_displayTotalReviews)', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total after discount')).toBeInTheDocument();  
}, 10000);

test('Displaying total number of reviews should show correct count (from calculateTotalWithDiscount_displayTotalReviews)', async () => {
  fetchMock.get('/api/reviews/count?productId=123', { count: 100 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/count?productId=123')).toHaveLength(1);
  expect(screen.getByText('Total Reviews: 100')).toBeInTheDocument();
}, 10000);

test('Displaying total number of reviews should fail to fetch data (from calculateTotalWithDiscount_displayTotalReviews)', async () => {
  fetchMock.get('/api/reviews/count?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/count?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load total reviews count')).toBeInTheDocument();
}, 10000);

