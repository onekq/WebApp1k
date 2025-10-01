import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProducts_customerLoyaltyPoints_selectPaymentMethod';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Comparing multiple products succeeds.', async () => {
  fetchMock.post('/api/compare', { status: 200, body: [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Compare Products')); });

  expect(fetchMock.calls('/api/compare').length).toBe(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('Product B')).toBeInTheDocument();
}, 10000);

test('Comparing multiple products fails with error message.', async () => {
  fetchMock.post('/api/compare', { status: 500, body: { message: 'Comparison failed' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Compare Products')); });

  expect(fetchMock.calls('/api/compare').length).toBe(1);
  expect(screen.getByText('Comparison failed')).toBeInTheDocument();
}, 10000);

test('Customer Loyalty Points success awards points', async () => {
  fetchMock.post('/api/orders/1/points', { points: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Award Points')); });

  expect(fetchMock.calls('/api/orders/1/points').length).toBe(1);
  expect(screen.getByText('10 points awarded')).toBeInTheDocument();
}, 10000);

test('Customer Loyalty Points failure shows error message', async () => {
  fetchMock.post('/api/orders/1/points', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Award Points')); });

  expect(screen.getByText('Error awarding points')).toBeInTheDocument();
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
