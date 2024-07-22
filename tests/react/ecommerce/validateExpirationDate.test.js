import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Payment from './validateExpirationDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('valid expiration date', async () => {
  fetchMock.post('/api/validate-expiration-date', { valid: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expiration-date-input'), { target: { value: '12/25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid expiration date', async () => {
  fetchMock.post('/api/validate-expiration-date', 400);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expiration-date-input'), { target: { value: '13/25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid expiration date')).toBeInTheDocument();
}, 10000);

