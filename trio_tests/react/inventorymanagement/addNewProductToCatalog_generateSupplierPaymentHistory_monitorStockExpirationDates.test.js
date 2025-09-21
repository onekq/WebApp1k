import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewProductToCatalog_generateSupplierPaymentHistory_monitorStockExpirationDates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Adding a new product to the catalog updates the inventory list correctly.', async () => {
  fetchMock.post('/products', { id: 1, name: "New Product" });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/add product/i)); });

  expect(fetchMock.calls('/products')).toHaveLength(1);
  expect(screen.getByText(/new product/i)).toBeInTheDocument();
}, 10000);

test('Adding a new product to the catalog shows an error message if there is a failure.', async () => {
  fetchMock.post('/products', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/add product/i)); });

  expect(fetchMock.calls('/products')).toHaveLength(1);
  expect(screen.getByText(/error adding product/i)).toBeInTheDocument();
}, 10000);

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

test('Lists products nearing expiration', async () => {
  fetchMock.get('/api/stock/expiration', { products: [{ name: "Product A", expiresIn: 5 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/expiration').length).toBe(1);
  expect(screen.getByText(/Product A - Expires in 5 days/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching expiration dates', async () => {
  fetchMock.get('/api/stock/expiration', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/expiration').length).toBe(1);
  expect(screen.getByText(/Error fetching expiration dates/i)).toBeInTheDocument();
}, 10000);
