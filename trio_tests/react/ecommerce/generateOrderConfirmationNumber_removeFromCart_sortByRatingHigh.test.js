import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './generateOrderConfirmationNumber_removeFromCart_sortByRatingHigh';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Generates order confirmation number successfully', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', { confirmationNumber: '123456' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation number: 123456')).toBeInTheDocument();
}, 10000);

test('Fails to generate order confirmation number', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate order confirmation number')).toBeInTheDocument();
}, 10000);

test('removeFromCart: successfully remove a product from the cart', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Removed successfully')).toBeInTheDocument();  
}, 10000);

test('removeFromCart: fail to remove a product from the cart with error message', async () => {
  fetchMock.delete('/api/cart/1', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to remove item from cart')).toBeInTheDocument();  
}, 10000);

test('sorts by highest rating successfully', async () => {
  fetchMock.get('/api/products?sort=rating_desc', { products: [{ id: 1, name: 'Top Rated Phone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Top Rated Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by highest rating and shows error', async () => {
  fetchMock.get('/api/products?sort=rating_desc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);
