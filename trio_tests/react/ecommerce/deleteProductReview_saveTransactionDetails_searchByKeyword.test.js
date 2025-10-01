import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductReview_saveTransactionDetails_searchByKeyword';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Deleting a product review should succeed', async () => {
  fetchMock.delete('/api/reviews/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.queryByText('Review deleted successfully')).toBeInTheDocument();
}, 10000);

test('Deleting a product review should fail due to server error', async () => {
  fetchMock.delete('/api/reviews/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Failed to delete review')).toBeInTheDocument();
}, 10000);

test('save transaction details successfully', async () => {
  fetchMock.post('/api/save-transaction', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Transaction saved successfully')).toBeInTheDocument();
}, 10000);

test('fail to save transaction details', async () => {
  fetchMock.post('/api/save-transaction', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save transaction')).toBeInTheDocument();
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
