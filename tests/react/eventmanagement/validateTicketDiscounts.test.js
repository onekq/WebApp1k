import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateTicketDiscounts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('applies ticket discount successfully', async () => {
  fetchMock.post('/applyDiscount', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'DISCOUNT50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(fetchMock.calls('/applyDiscount').length).toEqual(1);
  expect(screen.getByText('Discount applied')).toBeInTheDocument();
}, 10000);

test('fails to apply ticket discount', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(screen.getByText('Invalid discount code.')).toBeInTheDocument();
}, 10000);

