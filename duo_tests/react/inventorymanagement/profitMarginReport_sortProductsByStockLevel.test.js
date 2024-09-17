import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './profitMarginReport_sortProductsByStockLevel';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates profit margin report successfully.', async () => {
  fetchMock.post('/api/profit-margin-report', { body: { status: 'success', data: { margin: 30 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Profit Margin: 30%')).toBeInTheDocument();
}, 10000);

test('Fails to generate profit margin report due to server error.', async () => {
  fetchMock.post('/api/profit-margin-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Sorting products by stock level orders them numerically.', async () => {
  fetchMock.get('/products?sort=stock', { products: [{ id: 1, stock: 5, name: 'Low Stock Product' }, { id: 2, stock: 100, name: 'High Stock Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/low stock product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by stock level shows an error message if failed.', async () => {
  fetchMock.get('/products?sort=stock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
}, 10000);