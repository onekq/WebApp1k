import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './salesTaxCalculation_securePaymentProcessing_promotionManagement_updateCartQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculates sales tax based on location. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/salesTax', { body: { tax: 8 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'NY' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Sales tax: 8%')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate sales tax. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/salesTax', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'CA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Failed to calculate sales tax')).toBeInTheDocument();
}, 10000);

test('processes payment securely. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/payment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment processed securely')).toBeInTheDocument();
}, 10000);

test('displays error on secure payment failure. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment failed to process securely')).toBeInTheDocument();
}, 10000);

test('manages promotions successfully. (from promotionManagement_updateCartQuantity)', async () => {
  fetchMock.post('/api/manage-promotion', { status: 200, body: { message: 'Promotion updated successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('promotion-input'), { target: { value: '20% off' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-promotion-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Promotion updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to manage promotions with an error message. (from promotionManagement_updateCartQuantity)', async () => {
  fetchMock.post('/api/manage-promotion', { status: 400, body: { error: 'Failed to update promotion' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('promotion-input'), { target: { value: '20% off' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-promotion-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update promotion')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart succeeds. (from promotionManagement_updateCartQuantity)', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Quantity updated successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart fails with error message. (from promotionManagement_updateCartQuantity)', async () => {
  fetchMock.put('/api/cart/1', { status: 400, body: { message: 'Invalid quantity' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '-1' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Invalid quantity')).toBeInTheDocument();
}, 10000);

