import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './alertOnSupplierContractExpiration_handleReturns';

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

test('Ensure handling returns updates inventory levels and order status correctly.', async () => {
  fetchMock.post('/api/returns', { status: 200, body: { success: true, newStockLevel: 105 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('105');
}, 10000);

test('Handling returns doesn\'t update inventory levels due to error.', async () => {
  fetchMock.post('/api/returns', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error processing return.')).toBeInTheDocument();
}, 10000);