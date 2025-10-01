import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ApproveReview from '../approveOrDisapproveReviews';
import App from './approveOrDisapproveReviews_deleteProductReview_generateInvoice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Approving a review should succeed', async () => {
  fetchMock.post('/api/reviews/approve/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><ApproveReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Approve')); });

  expect(fetchMock.calls('/api/reviews/approve/123')).toHaveLength(1);
  expect(screen.getByText('Review approved')).toBeInTheDocument();
}, 10000);

test('Disapproving a review should fail due to server error', async () => {
  fetchMock.post('/api/reviews/disapprove/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><DisapproveReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Disapprove')); });

  expect(fetchMock.calls('/api/reviews/disapprove/123')).toHaveLength(1);
  expect(screen.getByText('Failed to disapprove review')).toBeInTheDocument();
}, 10000);

test('Deleting a product review should succeed', async () => {
  fetchMock.delete('/api/reviews/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><DeleteReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.queryByText('Review deleted successfully')).toBeInTheDocument();
}, 10000);

test('Deleting a product review should fail due to server error', async () => {
  fetchMock.delete('/api/reviews/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><DeleteReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Failed to delete review')).toBeInTheDocument();
}, 10000);

test('Generates invoice successfully', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);
