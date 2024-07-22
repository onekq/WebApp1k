import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CalculateMortgage from './calculateMortgagePayments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Calculate mortgage payments successfully', async () => {
  fetchMock.post('/api/mortgage-calc', { estimatedPayment: 1200 });

  await act(async () => { render(<MemoryRouter><CalculateMortgage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('estimate')).toBeInTheDocument();
}, 10000);

test('Calculate mortgage payments fails with error', async () => {
  fetchMock.post('/api/mortgage-calc', 500);

  await act(async () => { render(<MemoryRouter><CalculateMortgage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error calculating mortgage.')).toBeInTheDocument();
}, 10000);

