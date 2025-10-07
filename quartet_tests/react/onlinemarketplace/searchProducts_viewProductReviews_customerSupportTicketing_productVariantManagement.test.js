import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchProducts_viewProductReviews_customerSupportTicketing_productVariantManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Search Products successfully displays relevant results. (from searchProducts_viewProductReviews)', async () => {
  fetchMock.get('/api/search', { status: 200, body: { results: ['Product 1', 'Product 2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'query' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('Search Products fails and displays error message. (from searchProducts_viewProductReviews)', async () => {
  fetchMock.get('/api/search', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'query' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
}, 10000);

test('View Product Reviews successfully displays reviews. (from searchProducts_viewProductReviews)', async () => {
  fetchMock.get('/api/reviews', { status: 200, body: { reviews: ['Review 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review 1')).toBeInTheDocument();
}, 10000);

test('View Product Reviews fails and displays error message. (from searchProducts_viewProductReviews)', async () => {
  fetchMock.get('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch reviews')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing success creates a new ticket (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/tickets', { id: 1, issue: 'Issue description' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket created')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing failure shows error message (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/tickets', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(screen.getByText('Error creating ticket')).toBeInTheDocument();
}, 10000);

test('Managing product variants succeeds. (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/products/1/variants', { status: 200, body: { id: 1, size: 'M', color: 'Red' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'M' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Variant added successfully')).toBeInTheDocument();
}, 10000);

test('Managing product variants fails with error message. (from customerSupportTicketing_productVariantManagement)', async () => {
  fetchMock.post('/api/products/1/variants', { status: 400, body: { message: 'Invalid variant details' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Invalid variant details')).toBeInTheDocument();
}, 10000);

