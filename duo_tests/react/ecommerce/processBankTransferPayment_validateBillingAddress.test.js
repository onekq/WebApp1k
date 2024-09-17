import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processBankTransferApp_validateBillingAddress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('process bank transfer payment successfully', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('Validates billing address successfully', async () => {
  fetchMock.post('/api/validateBillingAddress', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '456 Elm St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Billing address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate billing address with invalid data', async () => {
  fetchMock.post('/api/validateBillingAddress', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid billing address')).toBeInTheDocument();
}, 10000);