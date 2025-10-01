import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountsOnOrders_generateSupplierPaymentHistory_handleReturns';

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

test('Successfully generates supplier payment history.', async () => {
  fetchMock.get('/api/suppliers/1/payments', { status: 200, body: { payments: ['Payment1', 'Payment2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-payment-history-button')); });

  expect(fetchMock.called('/api/suppliers/1/payments')).toBe(true);
  expect(screen.getByText('Payment1')).toBeInTheDocument();
  expect(screen.getByText('Payment2')).toBeInTheDocument();
}, 10000);

test('Fails to generate supplier payment history.', async () => {
  fetchMock.get('/api/suppliers/1/payments', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-payment-history-button')); });

  expect(fetchMock.called('/api/suppliers/1/payments')).toBe(true);
  expect(screen.getByText('Failed to generate payment history')).toBeInTheDocument();
}, 10000);

test('Ensure handling returns updates inventory levels and order status correctly.', async () => {
  fetchMock.post('/api/returns', { status: 200, body: { success: true, newStockLevel: 105 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('105');
}, 10000);

test('Handling returns doesn\'t update inventory levels due to error.', async () => {
  fetchMock.post('/api/returns', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error processing return.')).toBeInTheDocument();
}, 10000);
