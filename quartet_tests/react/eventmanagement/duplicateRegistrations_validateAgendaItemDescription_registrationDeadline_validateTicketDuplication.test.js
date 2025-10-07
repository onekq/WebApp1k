import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicateRegistrations_validateAgendaItemDescription_registrationDeadline_validateTicketDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Preventing duplicate registration is successful (from duplicateRegistrations_validateAgendaItemDescription)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'unique@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Duplicate registrations are successfully prevented (from duplicateRegistrations_validateAgendaItemDescription)', async () => {
  fetchMock.post('/register-attendee', { status: 409 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/duplicate registration detected/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates agenda item description. (from duplicateRegistrations_validateAgendaItemDescription)', async () => {
  fetchMock.post('/api/validateAgendaItemDescription', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-description-input'), { target: { value: 'This is a valid description' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-description-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Description is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate long agenda item description. (from duplicateRegistrations_validateAgendaItemDescription)', async () => {
  fetchMock.post('/api/validateAgendaItemDescription', { error: 'Description is too long' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-description-input'), { target: { value: 'This description is way too long and exceeds the character limit set by the system.' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-description-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Description is too long')).toBeInTheDocument();
}, 10000);

test('Registration is successful if within the deadline (from registrationDeadline_validateTicketDuplication)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Registration fails if the deadline is passed (from registrationDeadline_validateTicketDuplication)', async () => {
  fetchMock.post('/register-attendee', { status: 403 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration deadline has passed/i)).toBeInTheDocument();
}, 10000);

test('allows ticket duplication (from registrationDeadline_validateTicketDuplication)', async () => {
  fetchMock.post('/duplicateTicket', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(fetchMock.calls('/duplicateTicket').length).toEqual(1);
  expect(screen.getByText('Ticket duplicated')).toBeInTheDocument();
}, 10000);

test('fails to duplicate ticket (from registrationDeadline_validateTicketDuplication)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(screen.getByText('Unable to duplicate ticket.')).toBeInTheDocument();
}, 10000);

