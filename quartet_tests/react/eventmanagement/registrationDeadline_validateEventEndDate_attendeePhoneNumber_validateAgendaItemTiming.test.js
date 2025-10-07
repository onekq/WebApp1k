import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './registrationDeadline_validateEventEndDate_attendeePhoneNumber_validateAgendaItemTiming';

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

