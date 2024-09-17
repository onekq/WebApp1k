import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductFromCatalog_generateInvoiceForSalesOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deleting a product removes it from the inventory list.', async () => {
  fetchMock.delete('/products/1', 204);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.queryByText(/product 1 name/i)).not.toBeInTheDocument();
}, 10000);

test('Deleting a product shows an error message if the deletion fails.', async () => {
  fetchMock.delete('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error deleting product/i)).toBeInTheDocument();
}, 10000);

test('Verify generating an invoice for a sales order includes all relevant details.', async () => {
  fetchMock.get('/api/invoice', { status: 200, body: { invoice: { id: 1, total: 100, items: [{ item: 'Product A', quantity: 5 }] } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateInvoice')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Generating an invoice for a sales order doesn\'t show details due to error.', async () => {
  fetchMock.get('/api/invoice', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateInvoice')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating invoice.')).toBeInTheDocument();
}, 10000);