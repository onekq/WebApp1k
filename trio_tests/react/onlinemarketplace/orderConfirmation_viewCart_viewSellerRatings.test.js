import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './orderConfirmation_viewCart_viewSellerRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('displays order confirmation details correctly.', async () => {
  fetchMock.get('/api/order/confirmation', { body: { orderId: '12345' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Order ID: 12345')).toBeInTheDocument();
}, 10000);

test('displays error on failing to fetch order confirmation.', async () => {
  fetchMock.get('/api/order/confirmation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Failed to fetch order confirmation')).toBeInTheDocument();
}, 10000);

test('displays cart details correctly.', async () => {
  fetchMock.get('/api/cart', { body: { items: ['item1', 'item2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('item1')).toBeInTheDocument();
  expect(screen.getByText('item2')).toBeInTheDocument();
}, 10000);

test('displays error message on fetching cart failure.', async () => {
  fetchMock.get('/api/cart', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('Failed to fetch cart details')).toBeInTheDocument();
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
