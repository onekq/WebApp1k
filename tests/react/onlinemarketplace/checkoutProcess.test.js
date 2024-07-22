import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './checkoutProcess';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('validates checkout steps successfully.', async () => {
  fetchMock.post('/api/checkout', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Proceed to Checkout')); });

  expect(fetchMock.calls('/api/checkout').length).toEqual(1);
  expect(screen.getByText('Checkout Completed')).toBeInTheDocument();
}, 10000);

test('displays error on checkout step failure.', async () => {
  fetchMock.post('/api/checkout', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Proceed to Checkout')); });

  expect(fetchMock.calls('/api/checkout').length).toEqual(1);
  expect(screen.getByText('Checkout failed')).toBeInTheDocument();
}, 10000);

