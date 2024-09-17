import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeFromCart_saveSearchCriteria';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Removing a product from the cart succeeds.', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed from cart successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Removed from cart successfully')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart fails with error message.', async () => {
  fetchMock.delete('/api/cart/1', { status: 400, body: { message: 'Failed to remove from cart' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Failed to remove from cart')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria successfully saves search criteria.', async () => {
  fetchMock.post('/api/saveSearch', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search criteria saved')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria fails and displays error message.', async () => {
  fetchMock.post('/api/saveSearch', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save search criteria')).toBeInTheDocument();
}, 10000);