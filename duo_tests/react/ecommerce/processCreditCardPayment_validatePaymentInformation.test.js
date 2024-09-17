import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processCreditCardApp_validateAppInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('process credit card payment successfully', async () => {
  fetchMock.post('/api/process-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-credit-card-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process credit card payment', async () => {
  fetchMock.post('/api/process-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-credit-card-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('Validates payment information successfully', async () => {
  fetchMock.post('/api/validatePaymentInformation', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '4111111111111111' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment information validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate payment information with invalid card number', async () => {
  fetchMock.post('/api/validatePaymentInformation', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '1234' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid payment information')).toBeInTheDocument();
}, 10000);