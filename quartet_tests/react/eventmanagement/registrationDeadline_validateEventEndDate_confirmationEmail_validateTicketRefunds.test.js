import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './registrationDeadline_validateEventEndDate_confirmationEmail_validateTicketRefunds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Registration is successful if within the deadline (from registrationDeadline_validateEventEndDate)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Registration fails if the deadline is passed (from registrationDeadline_validateEventEndDate)', async () => {
  fetchMock.post('/register-attendee', { status: 403 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration deadline has passed/i)).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid event end date (from registrationDeadline_validateEventEndDate)', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-14T10:00' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for end date before start date (from registrationDeadline_validateEventEndDate)', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { 
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-12-15T10:00' } }); 
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-14T10:00' } });
  });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
}, 10000);

test('Confirmation email is successfully sent upon registration (from confirmationEmail_validateTicketRefunds)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Confirmation email is not sent if registration fails (from confirmationEmail_validateTicketRefunds)', async () => {
  fetchMock.post('/register-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
}, 10000);

test('processes ticket refund successfully (from confirmationEmail_validateTicketRefunds)', async () => {
  fetchMock.post('/processRefund', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(fetchMock.calls('/processRefund').length).toEqual(1);
  expect(screen.getByText('Refund processed')).toBeInTheDocument();
}, 10000);

test('fails to process ticket refund (from confirmationEmail_validateTicketRefunds)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(screen.getByText('Unable to process refund.')).toBeInTheDocument();
}, 10000);

