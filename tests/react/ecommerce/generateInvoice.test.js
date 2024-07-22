import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './generateInvoice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates invoice successfully', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);

