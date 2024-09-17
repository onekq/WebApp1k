import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeePhoneNumber_validateTicketDiscounts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Attendee phone number is successfully validated if format is correct', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee phone number validation fails if format is incorrect', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
}, 10000);

test('applies ticket discount successfully', async () => {
  fetchMock.post('/applyDiscount', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'DISCOUNT50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(fetchMock.calls('/applyDiscount').length).toEqual(1);
  expect(screen.getByText('Discount applied')).toBeInTheDocument();
}, 10000);

test('fails to apply ticket discount', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(screen.getByText('Invalid discount code.')).toBeInTheDocument();
}, 10000);