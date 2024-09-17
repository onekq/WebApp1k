import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateCreditCardNumber_validateShippingAddress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('valid credit card number', async () => {
  fetchMock.post('/api/validate-credit-card', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('credit-card-input'), { target: { value: '4111111111111111' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid credit card number', async () => {
  fetchMock.post('/api/validate-credit-card', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('credit-card-input'), { target: { value: '1234' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid credit card number')).toBeInTheDocument();
}, 10000);

test('Validates shipping address successfully', async () => {
  fetchMock.post('/api/validateShippingAddress', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: '123 Main St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate shipping address with invalid data', async () => {
  fetchMock.post('/api/validateShippingAddress', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid shipping address')).toBeInTheDocument();
}, 10000);