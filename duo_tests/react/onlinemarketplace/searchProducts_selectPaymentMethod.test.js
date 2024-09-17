import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchProducts_selectPaymentMethod';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Search Products successfully displays relevant results.', async () => {
  fetchMock.get('/api/search', { status: 200, body: { results: ['Product 1', 'Product 2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'query' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('Search Products fails and displays error message.', async () => {
  fetchMock.get('/api/search', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'query' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
}, 10000);

test('validates selecting a payment method successfully.', async () => {
  fetchMock.post('/api/payment-method', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Select Payment Method')); });
  await act(async () => { fireEvent.click(screen.getByText('Credit Card')); });

  expect(fetchMock.calls('/api/payment-method').length).toEqual(1);
  expect(screen.getByText('Credit Card selected')).toBeInTheDocument();
}, 10000);

test('displays error on invalid payment method selection.', async () => {
  fetchMock.post('/api/payment-method', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Select Payment Method')); });
  await act(async () => { fireEvent.click(screen.getByText('Expired Card')); });

  expect(fetchMock.calls('/api/payment-method').length).toEqual(1);
  expect(screen.getByText('Invalid payment method selected')).toBeInTheDocument();
}, 10000);