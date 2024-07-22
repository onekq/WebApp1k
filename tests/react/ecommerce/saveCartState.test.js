import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Cart from './saveCartState';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('saveCartState: successfully save cart state for a logged-in user', async () => {
  fetchMock.post('/api/cart/save', { status: 200, body: { message: 'Saved' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cart state saved successfully')).toBeInTheDocument();  
}, 10000);

test('saveCartState: fail to save cart state with error message', async () => {
  fetchMock.post('/api/cart/save', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save cart state')).toBeInTheDocument();  
}, 10000);