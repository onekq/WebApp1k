import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_viewBiddingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Adding a product to the cart succeeds.', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added to cart successfully' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Added to cart successfully')).toBeInTheDocument();
}, 10000);

test('Adding a product to the cart fails with error message.', async () => {
  fetchMock.post('/api/cart', { status: 400, body: { message: 'Product out of stock' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Product out of stock')).toBeInTheDocument();
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