import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicateRegistrations_validateAgendaItemDescription_confirmationEmail_validateTicketRefunds';

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

