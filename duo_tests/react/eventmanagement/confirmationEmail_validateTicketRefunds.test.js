import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './confirmationEmail_validateTicketRefunds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Confirmation email is successfully sent upon registration', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Confirmation email is not sent if registration fails', async () => {
  fetchMock.post('/register-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
}, 10000);

test('processes ticket refund successfully', async () => {
  fetchMock.post('/processRefund', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(fetchMock.calls('/processRefund').length).toEqual(1);
  expect(screen.getByText('Refund processed')).toBeInTheDocument();
}, 10000);

test('fails to process ticket refund', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(screen.getByText('Unable to process refund.')).toBeInTheDocument();
}, 10000);