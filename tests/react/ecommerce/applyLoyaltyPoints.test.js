import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './applyLoyaltyPoints';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Applies loyalty points successfully', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Loyalty points applied successfully')).toBeInTheDocument();
}, 10000);

test('Fails to apply loyalty points', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply loyalty points')).toBeInTheDocument();
}, 10000);