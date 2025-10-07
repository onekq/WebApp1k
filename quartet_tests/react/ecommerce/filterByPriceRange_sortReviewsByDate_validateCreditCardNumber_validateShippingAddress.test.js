import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPriceRange_sortReviewsByDate_validateCreditCardNumber_validateShippingAddress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters by price range successfully (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', { products: [{ id: 1, name: 'Laptop' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Laptop')).toBeInTheDocument();
}, 10000);

test('fails to filter by price range and shows error (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by newest date should display reviews in order (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=newest', [{ id: 1, content: 'Recent review' }, { id: 2, content: 'Old review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="newest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=newest')).toHaveLength(1);
  expect(screen.getByText('Recent review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by oldest date should display reviews in order (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=oldest', [{ id: 1, content: 'Old review' }, { id: 2, content: 'Recent review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=oldest')).toHaveLength(1);
  expect(screen.getByText('Old review')).toBeInTheDocument();
}, 10000);

test('valid credit card number (from validateCreditCardNumber_validateShippingAddress)', async () => {
  fetchMock.post('/api/validate-credit-card', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('credit-card-input'), { target: { value: '4111111111111111' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid credit card number (from validateCreditCardNumber_validateShippingAddress)', async () => {
  fetchMock.post('/api/validate-credit-card', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('credit-card-input'), { target: { value: '1234' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid credit card number')).toBeInTheDocument();
}, 10000);

test('Validates shipping address successfully (from validateCreditCardNumber_validateShippingAddress)', async () => {
  fetchMock.post('/api/validateShippingAddress', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: '123 Main St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate shipping address with invalid data (from validateCreditCardNumber_validateShippingAddress)', async () => {
  fetchMock.post('/api/validateShippingAddress', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid shipping address')).toBeInTheDocument();
}, 10000);

