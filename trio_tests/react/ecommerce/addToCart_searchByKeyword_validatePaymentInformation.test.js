import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_searchByKeyword_validatePaymentInformation';

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

test('searches by keyword successfully', async () => {
  fetchMock.get('/api/products?search=phone', { products: [{ id: 1, name: 'Smartphone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'phone' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=phone')).toBe(true);
  expect(screen.getByText('Smartphone')).toBeInTheDocument();
}, 10000);

test('fails to search by keyword and shows error', async () => {
  fetchMock.get('/api/products?search=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

test('Validates payment information successfully', async () => {
  fetchMock.post('/api/validatePaymentInformation', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '4111111111111111' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment information validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate payment information with invalid card number', async () => {
  fetchMock.post('/api/validatePaymentInformation', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '1234' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid payment information')).toBeInTheDocument();
}, 10000);
