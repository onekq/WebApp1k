import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editSupplierDetails_totalInventoryValue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully edits supplier details.', async () => {
  fetchMock.put('/api/suppliers/1', { status: 200, body: { id: 1, name: 'Updated Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('edit-supplier-name'), { target: { value: 'Updated Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Updated Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to edit supplier details with server error.', async () => {
  fetchMock.put('/api/suppliers/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('edit-supplier-name'), { target: { value: 'Updated Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Failed to update supplier')).toBeInTheDocument();
}, 10000);

test('Calculates total inventory value successfully.', async () => {
  fetchMock.post('/api/total-inventory-value', { body: { status: 'success', data: { value: 10000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Inventory Value: $10,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total inventory value due to server error.', async () => {
  fetchMock.post('/api/total-inventory-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);