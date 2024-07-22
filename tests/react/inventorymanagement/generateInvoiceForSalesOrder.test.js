import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './generateInvoiceForSalesOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify generating an invoice for a sales order includes all relevant details.', async () => {
  fetchMock.get('/api/invoice', { status: 200, body: { invoice: { id: 1, total: 100, items: [{ item: 'Product A', quantity: 5 }] } } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateInvoice')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Generating an invoice for a sales order doesn\'t show details due to error.', async () => {
  fetchMock.get('/api/invoice', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateInvoice')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating invoice.')).toBeInTheDocument();
}, 10000);

