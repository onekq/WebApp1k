import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByBrand_refundPayment_updateProductStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('filters by brand successfully', async () => {
  fetchMock.get('/api/products?brand=sony', { products: [{ id: 1, name: 'PlayStation' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'sony' } }); });

  expect(fetchMock.called('/api/products?brand=sony')).toBe(true);
  expect(screen.getByText('PlayStation')).toBeInTheDocument();
}, 10000);

test('fails to filter by brand and shows error', async () => {
  fetchMock.get('/api/products?brand=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?brand=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

test('refund payment successfully', async () => {
  fetchMock.post('/api/refund-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('fail to refund payment', async () => {
  fetchMock.post('/api/refund-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund failed, please try again')).toBeInTheDocument();
}, 10000);

test('Updates product stock successfully', async () => {
  fetchMock.patch('/api/updateProductStock', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Product stock updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update product stock', async () => {
  fetchMock.patch('/api/updateProductStock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update product stock')).toBeInTheDocument();
}, 10000);
