import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editProductDetails_setReorderLevel_totalSalesValue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Editing product details updates the inventory list accurately.', async () => {
  fetchMock.put('/products/1', { id: 1, name: 'Updated Product' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/updated product/i)).toBeInTheDocument();
}, 10000);

test('Editing product details shows an error message if the update fails.', async () => {
  fetchMock.put('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error saving changes/i)).toBeInTheDocument();
}, 10000);

test('Triggers alert on setting reorder level successfully', async () => {
  fetchMock.post('/api/reorder/level', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Reorder level set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting reorder level', async () => {
  fetchMock.post('/api/reorder/level', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Error setting reorder level/i)).toBeInTheDocument();
}, 10000);

test('Calculates total sales value successfully.', async () => {
  fetchMock.post('/api/total-sales-value', { body: { status: 'success', data: { value: 20000 }}});

  await act(async () => { render(<MemoryRouter><TotalSalesValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Sales Value: $20,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total sales value due to server error.', async () => {
  fetchMock.post('/api/total-sales-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><TotalSalesValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);
