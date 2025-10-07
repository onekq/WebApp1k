import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByCategory_flagInappropriateReviews_generateInvoice_validateCVV';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters by category successfully (from filterByCategory_flagInappropriateReviews)', async () => {
  fetchMock.get('/api/products?category=electronics', { products: [{ id: 1, name: 'TV' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'electronics' } }); });

  expect(fetchMock.called('/api/products?category=electronics')).toBe(true);
  expect(screen.getByText('TV')).toBeInTheDocument();
}, 10000);

test('fails to filter by category and shows error (from filterByCategory_flagInappropriateReviews)', async () => {
  fetchMock.get('/api/products?category=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?category=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

test('Flagging inappropriate review should succeed (from filterByCategory_flagInappropriateReviews)', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Review flagged successfully')).toBeInTheDocument();
}, 10000);

test('Flagging inappropriate review should fail due to server error (from filterByCategory_flagInappropriateReviews)', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Failed to flag review')).toBeInTheDocument();
}, 10000);

test('Generates invoice successfully (from generateInvoice_validateCVV)', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice (from generateInvoice_validateCVV)', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);

test('valid CVV (from generateInvoice_validateCVV)', async () => {
  fetchMock.post('/api/validate-cvv', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid CVV (from generateInvoice_validateCVV)', async () => {
  fetchMock.post('/api/validate-cvv', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '12A' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid CVV')).toBeInTheDocument();
}, 10000);

