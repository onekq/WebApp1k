import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './leaveProductReview_updateCartQuantity_viewCart';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Leave Product Review successfully posts a review.', async () => {
  fetchMock.post('/api/reviews', { status: 200 });

  await act(async () => { render(<MemoryRouter><LeaveProductReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-review-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review posted')).toBeInTheDocument();
}, 10000);

test('Leave Product Review fails and displays error message.', async () => {
  fetchMock.post('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><LeaveProductReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-review-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post review')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart succeeds.', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Quantity updated successfully' } });

  await act(async () => { render(<MemoryRouter><CartPage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart fails with error message.', async () => {
  fetchMock.put('/api/cart/1', { status: 400, body: { message: 'Invalid quantity' } });

  await act(async () => { render(<MemoryRouter><CartPage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '-1' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Invalid quantity')).toBeInTheDocument();
}, 10000);

test('displays cart details correctly.', async () => {
  fetchMock.get('/api/cart', { body: { items: ['item1', 'item2'] } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('item1')).toBeInTheDocument();
  expect(screen.getByText('item2')).toBeInTheDocument();
}, 10000);

test('displays error message on fetching cart failure.', async () => {
  fetchMock.get('/api/cart', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('Failed to fetch cart details')).toBeInTheDocument();
}, 10000);
