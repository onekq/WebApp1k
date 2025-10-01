import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalWithDiscount_processPayment_saveCartState';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateTotalWithDiscount: successfully calculate total with discount applied', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 200, body: { total: '80.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total after discount: $80.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalWithDiscount: fail to calculate total with discount applied with error message', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total after discount')).toBeInTheDocument();  
}, 10000);

test('Processes payment successfully', async () => {
  fetchMock.post('/api/processPayment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Process Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment processed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to process payment', async () => {
  fetchMock.post('/api/processPayment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Process Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment processing failed')).toBeInTheDocument();
}, 10000);

test('saveCartState: successfully save cart state for a logged-in user', async () => {
  fetchMock.post('/api/cart/save', { status: 200, body: { message: 'Saved' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cart state saved successfully')).toBeInTheDocument();  
}, 10000);

test('saveCartState: fail to save cart state with error message', async () => {
  fetchMock.post('/api/cart/save', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save cart state')).toBeInTheDocument();  
}, 10000);
