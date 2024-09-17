import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayRelatedApp_generateInvoice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays related products successfully', async () => {
  fetchMock.get('/api/products/1/related', { products: [{ id: 2, name: 'Related Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('Related Product')).toBeInTheDocument();
}, 10000);

test('fails to display related products and shows error', async () => {
  fetchMock.get('/api/products/1/related', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('No related products found')).toBeInTheDocument();
}, 10000);

test('Generates invoice successfully', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);