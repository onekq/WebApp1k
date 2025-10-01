import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './biddingOnProducts_productRatings_viewCart';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully places a bid on a product.', async () => {
  fetchMock.post('/api/bid', { status: 200, body: { success: 'Bid placed successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('bid-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('bid-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bid placed successfully')).toBeInTheDocument();
}, 10000);

test('fails to place a bid on a product with an error message displayed.', async () => {
  fetchMock.post('/api/bid', { status: 400, body: { error: 'Failed to place bid' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('bid-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('bid-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to place bid')).toBeInTheDocument();
}, 10000);

test('Product Ratings successfully displays product ratings.', async () => {
  fetchMock.get('/api/ratings', { status: 200, body: { ratings: ['Rating 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating 1')).toBeInTheDocument();
}, 10000);

test('Product Ratings fails and displays error message.', async () => {
  fetchMock.get('/api/ratings', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch ratings')).toBeInTheDocument();
}, 10000);

test('displays cart details correctly.', async () => {
  fetchMock.get('/api/cart', { body: { items: ['item1', 'item2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('item1')).toBeInTheDocument();
  expect(screen.getByText('item2')).toBeInTheDocument();
}, 10000);

test('displays error message on fetching cart failure.', async () => {
  fetchMock.get('/api/cart', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('Failed to fetch cart details')).toBeInTheDocument();
}, 10000);
