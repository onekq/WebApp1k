import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './biddingOnProducts';

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

