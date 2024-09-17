import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateExpensePerCategory_trackIncomeByPaymentMethod';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Calculate the average expense per category for a given period.', async () => {
  fetchMock.get('/api/calculate-average', { status: 200, body: { average: 250 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Average expense: 250')).toBeInTheDocument();
}, 10000);

test('Failure: Calculate the average expense per category for a given period.', async () => {
  fetchMock.get('/api/calculate-average', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('successfully tracks income by payment method', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 200, body: [{ id: 1, name: 'Salary' }] });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/salary/i)).toBeInTheDocument();
}, 10000);

test('fails to track income by payment method', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/failed to track income by payment method/i)).toBeInTheDocument();
}, 10000);