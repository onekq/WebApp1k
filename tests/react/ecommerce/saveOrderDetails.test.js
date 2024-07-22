import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './saveOrderDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

