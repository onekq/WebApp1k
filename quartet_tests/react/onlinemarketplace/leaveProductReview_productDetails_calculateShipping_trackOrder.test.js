import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './leaveProductReview_productDetails_calculateShipping_trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Leave Product Review successfully posts a review. (from leaveProductReview_productDetails)', async () => {
  fetchMock.post('/api/reviews', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-review-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review posted')).toBeInTheDocument();
}, 10000);

test('Leave Product Review fails and displays error message. (from leaveProductReview_productDetails)', async () => {
  fetchMock.post('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-review-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post review')).toBeInTheDocument();
}, 10000);

test('Product details retrieval and display succeed. (from leaveProductReview_productDetails)', async () => {
  fetchMock.get('/api/products/1', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Product details retrieval fails with error message. (from leaveProductReview_productDetails)', async () => {
  fetchMock.get('/api/products/1', { status: 404, body: { message: 'Product not found' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('correctly calculates shipping based on location. (from calculateShipping_trackOrder)', async () => {
  fetchMock.post('/api/shipping', { body: { cost: 15 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Shipping cost: $15')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate shipping. (from calculateShipping_trackOrder)', async () => {
  fetchMock.post('/api/shipping', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '54321' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();
}, 10000);

test('Track Order success displays tracking information (from calculateShipping_trackOrder)', async () => {
  fetchMock.get('/api/orders/1/track', { status: 'In Transit' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls('/api/orders/1/track').length).toBe(1);
  expect(screen.getByText('In Transit')).toBeInTheDocument();
}, 10000);

test('Track Order failure shows error message (from calculateShipping_trackOrder)', async () => {
  fetchMock.get('/api/orders/1/track', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(screen.getByText('Error tracking order')).toBeInTheDocument();
}, 10000);

