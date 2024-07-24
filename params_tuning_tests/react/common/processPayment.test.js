import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './processPayment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Processes payment successfully', async () => {
  fetchMock.post('/api/processPayment', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Process Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment processed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to process payment', async () => {
  fetchMock.post('/api/processPayment', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Process Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment processing failed')).toBeInTheDocument();
}, 10000);

