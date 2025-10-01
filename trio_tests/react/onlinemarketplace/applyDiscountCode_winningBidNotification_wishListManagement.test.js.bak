import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountCode_winningBidNotification_wishListManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('applies discount code successfully.', async () => {
  fetchMock.post('/api/discount', { body: { discount: 10 } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Discount applied: 10%')).toBeInTheDocument();
}, 10000);

test('displays error on invalid discount code.', async () => {
  fetchMock.post('/api/discount', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('successfully notifies user of winning bid.', async () => {
  fetchMock.get('/api/winning-bid', { status: 200, body: { message: 'You have won the bid!' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('You have won the bid!')).toBeInTheDocument();
}, 10000);

test('fails to notify user of winning bid with an error message.', async () => {
  fetchMock.get('/api/winning-bid', { status: 400, body: { error: 'No winning bid' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No winning bid')).toBeInTheDocument();
}, 10000);

test('Wish List Management success adds item to wish list', async () => {
  fetchMock.post('/api/wishlist', { id: 1, product: 'Product 1' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Wish List')); });

  expect(fetchMock.calls('/api/wishlist').length).toBe(1);
  expect(screen.getByText('Product 1 added to wish list')).toBeInTheDocument();
}, 10000);

test('Wish List Management failure shows error message', async () => {
  fetchMock.post('/api/wishlist', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Wish List')); });

  expect(screen.getByText('Error adding to wish list')).toBeInTheDocument();
}, 10000);
