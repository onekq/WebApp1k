import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Payment from './validateCVV';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('valid CVV', async () => {
  fetchMock.post('/api/validate-cvv', { valid: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid CVV', async () => {
  fetchMock.post('/api/validate-cvv', 400);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '12A' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid CVV')).toBeInTheDocument();
}, 10000);

