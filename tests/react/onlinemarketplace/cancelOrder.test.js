import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './cancelOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Cancel Order success removes order from list', async () => {
  fetchMock.delete('/api/orders/1', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(fetchMock.calls('/api/orders/1').length).toBe(1);
  expect(screen.queryByText('Order 1')).not.toBeInTheDocument();
}, 10000);

test('Cancel Order failure shows error message', async () => {
  fetchMock.delete('/api/orders/1', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(screen.getByText('Error cancelling order')).toBeInTheDocument();
}, 10000);

