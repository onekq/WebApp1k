import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalWithDiscount_processCreditCardPayment_validateCreditCardNumber';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateTotalWithDiscount: successfully calculate total with discount applied', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 200, body: { total: '80.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total after discount: $80.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalWithDiscount: fail to calculate total with discount applied with error message', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total after discount')).toBeInTheDocument();  
}, 10000);

test('process credit card payment successfully', async () => {
  fetchMock.post('/api/process-payment', { success: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-credit-card-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process credit card payment', async () => {
  fetchMock.post('/api/process-payment', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-credit-card-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('valid credit card number', async () => {
  fetchMock.post('/api/validate-credit-card', { valid: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('credit-card-input'), { target: { value: '4111111111111111' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid credit card number', async () => {
  fetchMock.post('/api/validate-credit-card', 400);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('credit-card-input'), { target: { value: '1234' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid credit card number')).toBeInTheDocument();
}, 10000);
