import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayAverageRating_updateAppQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displaying average product rating should show correct value', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { averageRating: 4.5 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument();
}, 10000);

test('Displaying average product rating should fail to fetch data', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load average rating')).toBeInTheDocument();
}, 10000);

test('updateCartQuantity: successfully update product quantity in cart', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Updated' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cart-quantity'), { target: { value: '3' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-quantity')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();  
}, 10000);

test('updateCartQuantity: fail to update product quantity in cart with error message', async () => {
  fetchMock.put('/api/cart/1', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cart-quantity'), { target: { value: '3' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-quantity')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update quantity')).toBeInTheDocument();  
}, 10000);