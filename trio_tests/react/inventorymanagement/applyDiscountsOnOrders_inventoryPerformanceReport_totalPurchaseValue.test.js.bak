import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountsOnOrders_inventoryPerformanceReport_totalPurchaseValue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Validate applying discounts on orders reduces the total amount correctly.', async () => {
  fetchMock.post('/api/discount', { status: 200, body: { success: true, discountedAmount: 90 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('discountedAmount')).toHaveTextContent('90');
}, 10000);

test('Applying discounts on orders doesn\'t reduce the amount due to error.', async () => {
  fetchMock.post('/api/discount', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error applying discount.')).toBeInTheDocument();
}, 10000);

test('Generates inventory performance report successfully.', async () => {
  fetchMock.post('/api/inventory-performance-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><InventoryPerformanceReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate inventory performance report due to server error.', async () => {
  fetchMock.post('/api/inventory-performance-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><InventoryPerformanceReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Calculates total purchase value successfully.', async () => {
  fetchMock.post('/api/total-purchase-value', { body: { status: 'success', data: { value: 15000 }}});

  await act(async () => { render(<MemoryRouter><TotalPurchaseValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Purchase Value: $15,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total purchase value due to server error.', async () => {
  fetchMock.post('/api/total-purchase-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><TotalPurchaseValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);
