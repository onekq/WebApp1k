import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewProductToCatalog_monitorStockLevels_totalPurchaseValue';

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

test('Displays correct current stock on success', async () => {
  fetchMock.get('/api/stock/levels', { stock: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/stock/levels').length).toBe(1);
  expect(screen.getByText(/Current Stock: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching stock levels', async () => {
  fetchMock.get('/api/stock/levels', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/stock/levels').length).toBe(1);
  expect(screen.getByText(/Error fetching stock levels/i)).toBeInTheDocument();
}, 10000);

test('Calculates total purchase value successfully.', async () => {
  fetchMock.post('/api/total-purchase-value', { body: { status: 'success', data: { value: 15000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Purchase Value: $15,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total purchase value due to server error.', async () => {
  fetchMock.post('/api/total-purchase-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);
