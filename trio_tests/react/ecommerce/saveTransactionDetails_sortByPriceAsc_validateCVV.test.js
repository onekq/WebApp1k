import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveTransactionDetails_sortByPriceAsc_validateCVV';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('save transaction details successfully', async () => {
  fetchMock.post('/api/save-transaction', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Transaction saved successfully')).toBeInTheDocument();
}, 10000);

test('fail to save transaction details', async () => {
  fetchMock.post('/api/save-transaction', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save transaction')).toBeInTheDocument();
}, 10000);

test('sorts by price ascending successfully', async () => {
  fetchMock.get('/api/products?sort=price_asc', { products: [{ id: 1, name: 'Budget Phone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Budget Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by price ascending and shows error', async () => {
  fetchMock.get('/api/products?sort=price_asc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);

test('valid CVV', async () => {
  fetchMock.post('/api/validate-cvv', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid CVV', async () => {
  fetchMock.post('/api/validate-cvv', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '12A' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid CVV')).toBeInTheDocument();
}, 10000);
