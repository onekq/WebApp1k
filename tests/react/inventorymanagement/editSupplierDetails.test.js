import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editSupplierDetails';

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

