import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LoyaltyComponent from './applyLoyaltyPoints';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Loyalty points should be calculated and applied for valid bookings.', async () => {
  fetchMock.post('/api/loyalty', 200);

  await act(async () => { render(<MemoryRouter><LoyaltyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-success')).toBeInTheDocument();
}, 10000);

test('Error in applying loyalty points should show error message.', async () => {
  fetchMock.post('/api/loyalty', 400);

  await act(async () => { render(<MemoryRouter><LoyaltyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-error')).toBeInTheDocument();
}, 10000);

