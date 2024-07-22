import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './generateOrderConfirmationNumber';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates order confirmation number successfully', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', { confirmationNumber: '123456' });

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation number: 123456')).toBeInTheDocument();
}, 10000);

test('Fails to generate order confirmation number', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate order confirmation number')).toBeInTheDocument();
}, 10000);

