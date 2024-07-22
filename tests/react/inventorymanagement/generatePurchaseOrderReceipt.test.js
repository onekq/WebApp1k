import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './generatePurchaseOrderReceipt';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure generating a purchase order receipt includes all relevant details.', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 200, body: { receipt: { id: 1, total: 200, items: [{ item: 'Product B', quantity: 10 }] } } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
  expect(screen.getByText('200')).toBeInTheDocument();
}, 10000);

test("Generating a purchase order receipt doesn't show details due to error.", async () => {
  fetchMock.get('/api/purchase-receipt', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating receipt.')).toBeInTheDocument();
}, 10000);

