import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalCost_validateBillingAddress_sortByPriceAsc_sortReviewsByDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTotalCost: successfully display total cost including all charges (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.get('/api/cart/total', { status: 200, body: { total: '123.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total: $123.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalCost: fail to display total cost with error message (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.get('/api/cart/total', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total cost')).toBeInTheDocument();  
}, 10000);

test('Validates billing address successfully (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.post('/api/validateBillingAddress', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '456 Elm St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Billing address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate billing address with invalid data (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.post('/api/validateBillingAddress', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid billing address')).toBeInTheDocument();
}, 10000);

test('sorts by price ascending successfully (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?sort=price_asc', { products: [{ id: 1, name: 'Budget Phone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Budget Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by price ascending and shows error (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?sort=price_asc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by newest date should display reviews in order (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=newest', [{ id: 1, content: 'Recent review' }, { id: 2, content: 'Old review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="newest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=newest')).toHaveLength(1);
  expect(screen.getByText('Recent review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by oldest date should display reviews in order (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=oldest', [{ id: 1, content: 'Old review' }, { id: 2, content: 'Recent review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=oldest')).toHaveLength(1);
  expect(screen.getByText('Old review')).toBeInTheDocument();
}, 10000);

