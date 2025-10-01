import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './alertOnSupplierContractExpiration_manageOrderCancellations_profitMarginReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully alerts on supplier contract expiration.', async () => {
  fetchMock.get('/api/suppliers/1/contract-expiration', { status: 200, body: { message: 'Contract is about to expire' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('check-contract-expiration-button')); });

  expect(fetchMock.called('/api/suppliers/1/contract-expiration')).toBe(true);
  expect(screen.getByText('Contract is about to expire')).toBeInTheDocument();
}, 10000);

test('Fails to alert on supplier contract expiration.', async () => {
  fetchMock.get('/api/suppliers/1/contract-expiration', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('check-contract-expiration-button')); });

  expect(fetchMock.called('/api/suppliers/1/contract-expiration')).toBe(true);
  expect(screen.getByText('Failed to check contract expiration')).toBeInTheDocument();
}, 10000);

test('Ensure managing order cancellations updates stock levels and order status correctly.', async () => {
  fetchMock.post('/api/cancel-order', { status: 200, body: { success: true, newStockLevel: 95 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancelOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('95');
}, 10000);

test('Managing order cancellations doesn\'t update stock levels due to error.', async () => {
  fetchMock.post('/api/cancel-order', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancelOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error cancelling order.')).toBeInTheDocument();
}, 10000);

test('Generates profit margin report successfully.', async () => {
  fetchMock.post('/api/profit-margin-report', { body: { status: 'success', data: { margin: 30 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Profit Margin: 30%')).toBeInTheDocument();
}, 10000);

test('Fails to generate profit margin report due to server error.', async () => {
  fetchMock.post('/api/profit-margin-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);
