import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalCost_calculateTotalWithDiscount_sendOrderConfirmationEmail';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateTotalCost: successfully display total cost including all charges', async () => {
  fetchMock.get('/api/cart/total', { status: 200, body: { total: '123.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total: $123.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalCost: fail to display total cost with error message', async () => {
  fetchMock.get('/api/cart/total', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total cost')).toBeInTheDocument();  
}, 10000);

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

test('Sends order confirmation email successfully', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation email sent successfully')).toBeInTheDocument();
}, 10000);

test('Fails to send order confirmation email', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send order confirmation email')).toBeInTheDocument();
}, 10000);
