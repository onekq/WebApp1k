import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './manageOrderCancellations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure managing order cancellations updates stock levels and order status correctly.', async () => {
  fetchMock.post('/api/cancel-order', { status: 200, body: { success: true, newStockLevel: 95 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancelOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('95');
}, 10000);

test("Managing order cancellations doesn't update stock levels due to error.", async () => {
  fetchMock.post('/api/cancel-order', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancelOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error cancelling order.')).toBeInTheDocument();
}, 10000);