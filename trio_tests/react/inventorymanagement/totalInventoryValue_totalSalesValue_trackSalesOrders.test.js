import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './totalInventoryValue_totalSalesValue_trackSalesOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Calculates total inventory value successfully.', async () => {
  fetchMock.post('/api/total-inventory-value', { body: { status: 'success', data: { value: 10000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Inventory Value: $10,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total inventory value due to server error.', async () => {
  fetchMock.post('/api/total-inventory-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Calculates total sales value successfully.', async () => {
  fetchMock.post('/api/total-sales-value', { body: { status: 'success', data: { value: 20000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Sales Value: $20,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total sales value due to server error.', async () => {
  fetchMock.post('/api/total-sales-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Ensure tracking sales orders shows all relevant orders correctly.', async () => {
  fetchMock.get('/api/sales-orders', { status: 200, body: { orders: [{ id: 1, item: 'Product A', quantity: 5 }] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackSalesOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
}, 10000);

test('Tracking sales orders doesn\'t show orders due to error.', async () => {
  fetchMock.get('/api/sales-orders', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackSalesOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching sales orders.')).toBeInTheDocument();
}, 10000);
