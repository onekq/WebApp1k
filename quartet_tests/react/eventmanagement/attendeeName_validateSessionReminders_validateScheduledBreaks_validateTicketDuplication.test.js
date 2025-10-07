import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeeName_validateSessionReminders_validateScheduledBreaks_validateTicketDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Attendee name is successfully validated and submitted (from attendeeName_validateSessionReminders)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee name validation fails if left empty (from attendeeName_validateSessionReminders)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates session reminders. (from attendeeName_validateSessionReminders)', async () => {
  fetchMock.post('/api/validateSessionReminders', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders set')).toBeInTheDocument();
}, 10000);

test('Fails to validate session reminders. (from attendeeName_validateSessionReminders)', async () => {
  fetchMock.post('/api/validateSessionReminders', { error: 'Failed to set reminders' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set reminders')).toBeInTheDocument();
}, 10000);

test('Successfully validates scheduled breaks. (from validateScheduledBreaks_validateTicketDuplication)', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect scheduled breaks. (from validateScheduledBreaks_validateTicketDuplication)', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { error: 'Breaks are incorrectly scheduled' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks are incorrectly scheduled')).toBeInTheDocument();
}, 10000);

test('allows ticket duplication (from validateScheduledBreaks_validateTicketDuplication)', async () => {
  fetchMock.post('/duplicateTicket', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(fetchMock.calls('/duplicateTicket').length).toEqual(1);
  expect(screen.getByText('Ticket duplicated')).toBeInTheDocument();
}, 10000);

test('fails to duplicate ticket (from validateScheduledBreaks_validateTicketDuplication)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(screen.getByText('Unable to duplicate ticket.')).toBeInTheDocument();
}, 10000);

