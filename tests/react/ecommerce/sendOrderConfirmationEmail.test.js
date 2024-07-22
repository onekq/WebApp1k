import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './sendOrderConfirmationEmail';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sends order confirmation email successfully', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation email sent successfully')).toBeInTheDocument();
}, 10000);

test('Fails to send order confirmation email', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send order confirmation email')).toBeInTheDocument();
}, 10000);

