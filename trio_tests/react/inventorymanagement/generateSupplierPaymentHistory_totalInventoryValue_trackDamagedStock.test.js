import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './generateSupplierPaymentHistory_totalInventoryValue_trackDamagedStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Calculates total inventory value successfully.', async () => {
  fetchMock.post('/api/total-inventory-value', { body: { status: 'success', data: { value: 10000 }}});

  await act(async () => { render(<MemoryRouter><TotalInventoryValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Inventory Value: $10,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total inventory value due to server error.', async () => {
  fetchMock.post('/api/total-inventory-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><TotalInventoryValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Updates inventory and status correctly for damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', { success: true, updatedStock: 60 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Damaged stock reported. Updated Stock: 60/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when reporting damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Error reporting damaged stock/i)).toBeInTheDocument();
}, 10000);
