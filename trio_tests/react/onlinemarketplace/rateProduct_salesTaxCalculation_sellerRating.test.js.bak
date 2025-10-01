import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rateProduct_salesTaxCalculation_sellerRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Rate Product successfully submits a rating.', async () => {
  fetchMock.post('/api/rate', { status: 200 });

  await act(async () => { render(<MemoryRouter><RateProduct /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating submitted')).toBeInTheDocument();
}, 10000);

test('Rate Product fails and displays error message.', async () => {
  fetchMock.post('/api/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><RateProduct /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);

test('calculates sales tax based on location.', async () => {
  fetchMock.post('/api/salesTax', { body: { tax: 8 } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'NY' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Sales tax: 8%')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate sales tax.', async () => {
  fetchMock.post('/api/salesTax', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'CA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Failed to calculate sales tax')).toBeInTheDocument();
}, 10000);

test('successfully rates a seller with a success message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 200, body: { message: 'Seller rated successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seller rated successfully')).toBeInTheDocument();
}, 10000);

test('fails to rate a seller with an error message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 400, body: { error: 'Failed to rate seller' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate seller')).toBeInTheDocument();
}, 10000);
