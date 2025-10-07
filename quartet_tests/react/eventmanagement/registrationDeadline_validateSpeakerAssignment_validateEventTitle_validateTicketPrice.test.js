import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './registrationDeadline_validateSpeakerAssignment_validateEventTitle_validateTicketPrice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Registration is successful if within the deadline (from registrationDeadline_validateSpeakerAssignment)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Registration fails if the deadline is passed (from registrationDeadline_validateSpeakerAssignment)', async () => {
  fetchMock.post('/register-attendee', { status: 403 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration deadline has passed/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates speaker assignment. (from registrationDeadline_validateSpeakerAssignment)', async () => {
  fetchMock.post('/api/validateSpeakerAssignment', { assigned: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('speaker-select'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-speaker-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Speaker assigned')).toBeInTheDocument();
}, 10000);

test('Fails to validate missing speaker assignment. (from registrationDeadline_validateSpeakerAssignment)', async () => {
  fetchMock.post('/api/validateSpeakerAssignment', { error: 'Speaker is required' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('speaker-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-speaker-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Speaker is required')).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid event title (from validateEventTitle_validateTicketPrice)', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for missing event title (from validateEventTitle_validateTicketPrice)', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
}, 10000);

test('sets ticket price successfully (from validateEventTitle_validateTicketPrice)', async () => {
  fetchMock.post('/ticketPrice', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketPrice'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketPrice').length).toEqual(1);
  expect(screen.getByText('Ticket price set')).toBeInTheDocument();
}, 10000);

test('fails to set ticket price (from validateEventTitle_validateTicketPrice)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketPrice'), { target: { value: '-10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Ticket price must be positive.')).toBeInTheDocument();
}, 10000);

