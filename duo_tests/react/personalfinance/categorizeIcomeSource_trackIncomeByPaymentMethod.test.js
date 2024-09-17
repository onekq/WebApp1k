import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeIcomeSource_trackIncomeByPaymentMethod';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully categorizes an income source', async () => {
  fetchMock.post('/income/1/categorize', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Job' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/categorize income source/i));
  });

  expect(fetchMock.calls('/income/1/categorize')).toHaveLength(1);
  expect(screen.getByText(/income source categorized successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to categorize an income source', async () => {
  fetchMock.post('/income/1/categorize', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/categorize income source/i));
  });

  expect(fetchMock.calls('/income/1/categorize')).toHaveLength(1);
  expect(screen.getByText(/failed to categorize income source/i)).toBeInTheDocument();
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