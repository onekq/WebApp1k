import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processBankTransferPayment_processCreditCardPayment_calculateTaxes_updateProductStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('process bank transfer payment successfully (from processBankTransferPayment_processCreditCardPayment)', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment (from processBankTransferPayment_processCreditCardPayment)', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('process credit card payment successfully (from processBankTransferPayment_processCreditCardPayment)', async () => {
  fetchMock.post('/api/process-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-credit-card-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process credit card payment (from processBankTransferPayment_processCreditCardPayment)', async () => {
  fetchMock.post('/api/process-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-credit-card-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('calculateTaxes: successfully calculate taxes (from calculateTaxes_updateProductStock)', async () => {
  fetchMock.get('/api/cart/taxes', { status: 200, body: { taxes: '8.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Taxes: $8.00')).toBeInTheDocument();  
}, 10000);

test('calculateTaxes: fail to calculate taxes with error message (from calculateTaxes_updateProductStock)', async () => {
  fetchMock.get('/api/cart/taxes', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate taxes')).toBeInTheDocument();  
}, 10000);

test('Updates product stock successfully (from calculateTaxes_updateProductStock)', async () => {
  fetchMock.patch('/api/updateProductStock', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Product stock updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update product stock (from calculateTaxes_updateProductStock)', async () => {
  fetchMock.patch('/api/updateProductStock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update product stock')).toBeInTheDocument();
}, 10000);

