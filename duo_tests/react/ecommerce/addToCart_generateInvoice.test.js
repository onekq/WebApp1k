import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToApp_generateInvoice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('addToCart: successfully add a product to the cart', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Added successfully')).toBeInTheDocument();  
}, 10000);

test('addToCart: fail to add a product to the cart with error message', async () => {
  fetchMock.post('/api/cart', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to add item to cart')).toBeInTheDocument();  
}, 10000);

test('Generates invoice successfully', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);