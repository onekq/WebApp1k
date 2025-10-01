import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './biddingOnProducts_cancelOrder_securePaymentProcessing';

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

test('Cancel Order success removes order from list', async () => {
  fetchMock.delete('/api/orders/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(fetchMock.calls('/api/orders/1').length).toBe(1);
  expect(screen.queryByText('Order 1')).not.toBeInTheDocument();
}, 10000);

test('Cancel Order failure shows error message', async () => {
  fetchMock.delete('/api/orders/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(screen.getByText('Error cancelling order')).toBeInTheDocument();
}, 10000);

test('processes payment securely.', async () => {
  fetchMock.post('/api/payment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment processed securely')).toBeInTheDocument();
}, 10000);

test('displays error on secure payment failure.', async () => {
  fetchMock.post('/api/payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment failed to process securely')).toBeInTheDocument();
}, 10000);
