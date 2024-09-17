import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalCost_validatePaymentInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTotalCost: successfully display total cost including all charges', async () => {
  fetchMock.get('/api/cart/total', { status: 200, body: { total: '123.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total: $123.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalCost: fail to display total cost with error message', async () => {
  fetchMock.get('/api/cart/total', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total cost')).toBeInTheDocument();  
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