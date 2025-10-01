import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './monitorStockLevels_reorderReport_sortProductsByName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Generates reorder report successfully.', async () => {
  fetchMock.post('/api/reorder-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><ReorderReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate reorder report due to server error.', async () => {
  fetchMock.post('/api/reorder-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><ReorderReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Sorting products by name orders them alphabetically.', async () => {
  fetchMock.get('/products?sort=name', { products: [{ id: 1, name: 'A Product' }, { id: 2, name: 'B Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by name/i)); });

  expect(fetchMock.calls('/products?sort=name')).toHaveLength(1);
  expect(screen.getByText(/a product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by name shows an error message if failed.', async () => {
  fetchMock.get('/products?sort=name', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by name/i)); });

  expect(fetchMock.calls('/products?sort=name')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
}, 10000);
