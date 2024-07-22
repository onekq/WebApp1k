import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './processSalesOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Processing a sales order reduces the stock level appropriately.', async () => {
  fetchMock.post('/api/sales-order', { status: 200, body: { success: true, newStockLevel: 90 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('90');
}, 10000);

test("Processing a sales order doesn't reduce stock level due to error.", async () => {
  fetchMock.post('/api/sales-order', { status: 500, body: { error: 'Internal Server Error' } });
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error processing the sales order.')).toBeInTheDocument();
}, 10000);

