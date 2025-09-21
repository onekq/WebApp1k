import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './updateCartQuantity_viewBiddingHistory_viewWishList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully views bidding history', async () => {
  const mockHistory = [
    { id: 1, item: 'Item 1', bid: 100 },
    { id: 2, item: 'Item 2', bid: 200 },
  ];
  
  fetchMock.get('/api/bidding-history', { status: 200, body: mockHistory });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  mockHistory.forEach(({ item, bid }) => {
    expect(screen.getByText(item)).toBeInTheDocument();
    expect(screen.getByText(`$${bid}`)).toBeInTheDocument();
  });
}, 10000);

test('fails to view bidding history with an error message displayed.', async () => {
  fetchMock.get('/api/bidding-history', { status: 400, body: { error: 'Failed to load history' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history')).toBeInTheDocument();
}, 10000);

test('View Wish List success displays wish list items', async () => {
  fetchMock.get('/api/wishlist', [{ id: 1, product: 'Product 1' }]);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });

  expect(fetchMock.calls('/api/wishlist').length).toBe(1);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('View Wish List failure shows error message', async () => {
  fetchMock.get('/api/wishlist', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });

  expect(screen.getByText('Error loading wish list')).toBeInTheDocument();
}, 10000);
