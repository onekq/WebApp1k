import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rma_selectPaymentMethod_viewSellerRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Return Merchandise Authorization (RMA) success initiates RMA process', async () => {
  fetchMock.post('/api/orders/1/rma', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(fetchMock.calls('/api/orders/1/rma').length).toBe(1);
  expect(screen.getByText('RMA initiated')).toBeInTheDocument();
}, 10000);

test('Return Merchandise Authorization (RMA) failure shows error message', async () => {
  fetchMock.post('/api/orders/1/rma', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Initiate RMA')); });

  expect(screen.getByText('Error initiating RMA')).toBeInTheDocument();
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

test('successfully views seller ratings.', async () => {
  const mockRatings = [
    { id: 1, rating: 5, comment: 'Excellent seller!' },
    { id: 2, rating: 4, comment: 'Very good service.' }
  ];
  fetchMock.get('/api/seller-ratings', { status: 200, body: mockRatings });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excellent seller!')).toBeInTheDocument();
  expect(screen.getByText('Very good service.')).toBeInTheDocument();
}, 10000);

test('fails to view seller ratings with an error message.', async () => {
  fetchMock.get('/api/seller-ratings', { status: 400, body: { error: 'Failed to load ratings' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load ratings')).toBeInTheDocument();
}, 10000);
