import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processBankTransferPayment_saveOrderDetails_sortByRatingHigh';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('process bank transfer payment successfully', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('Saves order details successfully', async () => {
  fetchMock.post('/api/saveOrderDetails', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Order Details')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order details saved successfully')).toBeInTheDocument();
}, 10000);

test('Fails to save order details', async () => {
  fetchMock.post('/api/saveOrderDetails', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Order Details')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save order details')).toBeInTheDocument();
}, 10000);

test('sorts by highest rating successfully', async () => {
  fetchMock.get('/api/products?sort=rating_desc', { products: [{ id: 1, name: 'Top Rated Phone' }] });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Top Rated Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by highest rating and shows error', async () => {
  fetchMock.get('/api/products?sort=rating_desc', 500);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);
