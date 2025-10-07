import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productListing_viewProductReviews_disputeResolution_productAvailabilityNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Product listing succeeds with required details. (from productListing_viewProductReviews)', async () => {
  fetchMock.post('/api/products', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Sample Product' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Product listed successfully')).toBeInTheDocument();
}, 10000);

test('Product listing fails with missing details error. (from productListing_viewProductReviews)', async () => {
  fetchMock.post('/api/products', { status: 400, body: { message: 'Missing required details' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Missing required details')).toBeInTheDocument();
}, 10000);

test('View Product Reviews successfully displays reviews. (from productListing_viewProductReviews)', async () => {
  fetchMock.get('/api/reviews', { status: 200, body: { reviews: ['Review 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review 1')).toBeInTheDocument();
}, 10000);

test('View Product Reviews fails and displays error message. (from productListing_viewProductReviews)', async () => {
  fetchMock.get('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch reviews')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution success resolves the dispute (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/orders/1/dispute', { status: 'Resolved' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(fetchMock.calls('/api/orders/1/dispute').length).toBe(1);
  expect(screen.getByText('Dispute resolved')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution failure shows error message (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/orders/1/dispute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(screen.getByText('Error resolving dispute')).toBeInTheDocument();
}, 10000);

test('Product availability notification succeeds. (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message. (from disputeResolution_productAvailabilityNotification)', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

