import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeeDetailUpdate_validateAgendaUpdates_validateTicketDescription';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Attendee details are successfully updated', async () => {
  fetchMock.put('/update-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/update/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/update successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee detail update fails if no changes detected', async () => {
  fetchMock.put('/update-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/update/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/no changes detected/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Agenda updated')).toBeInTheDocument();
}, 10000);

test('Fails to validate agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { error: 'Could not update agenda' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Could not update agenda')).toBeInTheDocument();
}, 10000);

test('ticket description within limit', async () => {
  fetchMock.post('/ticketDescription', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A valid description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketDescription').length).toEqual(1);
  expect(screen.getByText('Ticket description set')).toBeInTheDocument();
}, 10000);

test('ticket description exceeds limit', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A'.repeat(300) } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Description exceeds character limit.')).toBeInTheDocument();
}, 10000);
