import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './applyDiscountsOnOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Validate applying discounts on orders reduces the total amount correctly.', async () => {
  fetchMock.post('/api/discount', { status: 200, body: { success: true, discountedAmount: 90 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('discountedAmount')).toHaveTextContent('90');
}, 10000);

test('Applying discounts on orders doesn\'t reduce the amount due to error.', async () => {
  fetchMock.post('/api/discount', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error applying discount.')).toBeInTheDocument();
}, 10000);

