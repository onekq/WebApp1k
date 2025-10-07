import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShipping_viewBiddingHistory_removeFromCart_viewSellerRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('correctly calculates shipping based on location. (from calculateShipping_viewBiddingHistory)', async () => {
  fetchMock.post('/api/shipping', { body: { cost: 15 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Shipping cost: $15')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate shipping. (from calculateShipping_viewBiddingHistory)', async () => {
  fetchMock.post('/api/shipping', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '54321' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();
}, 10000);

test('successfully views bidding history (from calculateShipping_viewBiddingHistory)', async () => {
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

test('fails to view bidding history with an error message displayed. (from calculateShipping_viewBiddingHistory)', async () => {
  fetchMock.get('/api/bidding-history', { status: 400, body: { error: 'Failed to load history' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart succeeds. (from removeFromCart_viewSellerRatings)', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed from cart successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Removed from cart successfully')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart fails with error message. (from removeFromCart_viewSellerRatings)', async () => {
  fetchMock.delete('/api/cart/1', { status: 400, body: { message: 'Failed to remove from cart' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Failed to remove from cart')).toBeInTheDocument();
}, 10000);

test('successfully views seller ratings. (from removeFromCart_viewSellerRatings)', async () => {
  const mockRatings = [
    { id: 1, rating: 5, comment: 'Excellent seller!' },
    { id: 2, rating: 4, comment: 'Very good service.' }
  ];
  fetchMock.get('/api/seller-ratings', { status: 200, body: mockRatings });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excellent seller!')).toBeInTheDocument();
  expect(screen.getByText('Very good service.')).toBeInTheDocument();
}, 10000);

test('fails to view seller ratings with an error message. (from removeFromCart_viewSellerRatings)', async () => {
  fetchMock.get('/api/seller-ratings', { status: 400, body: { error: 'Failed to load ratings' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load ratings')).toBeInTheDocument();
}, 10000);

