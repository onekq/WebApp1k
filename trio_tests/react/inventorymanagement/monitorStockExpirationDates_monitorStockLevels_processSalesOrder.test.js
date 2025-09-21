import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './monitorStockExpirationDates_monitorStockLevels_processSalesOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Processing a sales order reduces the stock level appropriately.', async () => {
  fetchMock.post('/api/sales-order', { status: 200, body: { success: true, newStockLevel: 90 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('90');
}, 10000);

test('Processing a sales order doesn\'t reduce stock level due to error.', async () => {
  fetchMock.post('/api/sales-order', { status: 500, body: { error: 'Internal Server Error' } });
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error processing the sales order.')).toBeInTheDocument();
}, 10000);
