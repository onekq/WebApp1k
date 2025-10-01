import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPriceRange_generateInvoice_sortReviewsByHelpfulness';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('filters by price range successfully', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', { products: [{ id: 1, name: 'Laptop' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Laptop')).toBeInTheDocument();
}, 10000);

test('fails to filter by price range and shows error', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

test('Generates invoice successfully', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display reviews in order', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', [{ id: 1, helpfulness: 10, content: 'Helpful review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('Helpful review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display empty list when there are no reviews', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', []);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('No reviews')).toBeInTheDocument();
}, 10000);
