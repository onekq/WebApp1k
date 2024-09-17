import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './promotionManagement_updateCartQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('manages promotions successfully.', async () => {
  fetchMock.post('/api/manage-promotion', { status: 200, body: { message: 'Promotion updated successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('promotion-input'), { target: { value: '20% off' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-promotion-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Promotion updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to manage promotions with an error message.', async () => {
  fetchMock.post('/api/manage-promotion', { status: 400, body: { error: 'Failed to update promotion' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('promotion-input'), { target: { value: '20% off' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-promotion-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update promotion')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart succeeds.', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Quantity updated successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart fails with error message.', async () => {
  fetchMock.put('/api/cart/1', { status: 400, body: { message: 'Invalid quantity' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '-1' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Invalid quantity')).toBeInTheDocument();
}, 10000);