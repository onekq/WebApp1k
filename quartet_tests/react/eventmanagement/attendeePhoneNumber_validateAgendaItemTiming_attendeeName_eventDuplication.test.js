import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeePhoneNumber_validateAgendaItemTiming_attendeeName_eventDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Attendee phone number is successfully validated if format is correct (from attendeePhoneNumber_validateAgendaItemTiming)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee phone number validation fails if format is incorrect (from attendeePhoneNumber_validateAgendaItemTiming)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates agenda item timing. (from attendeePhoneNumber_validateAgendaItemTiming)', async () => {
  fetchMock.post('/api/validateAgendaItemTiming', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-start-time-input'), { target: { value: '10:00 AM' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-end-time-input'), { target: { value: '11:00 AM' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-agenda-timing-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Timing is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect agenda item timing. (from attendeePhoneNumber_validateAgendaItemTiming)', async () => {
  fetchMock.post('/api/validateAgendaItemTiming', { error: 'End time must be after start time' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-start-time-input'), { target: { value: '11:00 AM' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-end-time-input'), { target: { value: '10:00 AM' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-agenda-timing-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('End time must be after start time')).toBeInTheDocument();
}, 10000);

test('Attendee name is successfully validated and submitted (from attendeeName_eventDuplication)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee name validation fails if left empty (from attendeeName_eventDuplication)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
}, 10000);

test('Displays success message upon event duplication (from attendeeName_eventDuplication)', async () => {
  fetchMock.post('/api/event/duplicate', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event duplicated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to duplicate event (from attendeeName_eventDuplication)', async () => {
  fetchMock.post('/api/event/duplicate', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to duplicate the event')).toBeInTheDocument();
}, 10000);

