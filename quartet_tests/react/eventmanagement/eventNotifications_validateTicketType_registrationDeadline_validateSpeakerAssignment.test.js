import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventNotifications_validateTicketType_registrationDeadline_validateSpeakerAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon sending event notifications (from eventNotifications_validateTicketType)', async () => {
  fetchMock.post('/api/event/notify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event notifications sent successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to send event notifications (from eventNotifications_validateTicketType)', async () => {
  fetchMock.post('/api/event/notify', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send event notifications')).toBeInTheDocument();
}, 10000);

test('selects ticket type successfully (from eventNotifications_validateTicketType)', async () => {
  fetchMock.post('/ticketType', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketType'), { target: { value: 'VIP' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketType').length).toEqual(1);
  expect(screen.getByText('Ticket type selected')).toBeInTheDocument();
}, 10000);

test('fails to select ticket type (from eventNotifications_validateTicketType)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Please select a ticket type.')).toBeInTheDocument();
}, 10000);

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

