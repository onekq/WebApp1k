import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './confirmationEmail_eventCancellation_validateAgendaItemDescription';

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

test('Displays successful cancellation message upon event cancellation', async () => {
  fetchMock.post('/api/event/cancel', { success: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancel-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event successfully cancelled')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to cancel an event', async () => {
  fetchMock.post('/api/event/cancel', 400);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancel-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to cancel the event')).toBeInTheDocument();
}, 10000);

test('Successfully validates agenda item description.', async () => {
  fetchMock.post('/api/validateAgendaItemDescription', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-description-input'), { target: { value: 'This is a valid description' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-description-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Description is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate long agenda item description.', async () => {
  fetchMock.post('/api/validateAgendaItemDescription', { error: 'Description is too long' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-description-input'), { target: { value: 'This description is way too long and exceeds the character limit set by the system.' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-description-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Description is too long')).toBeInTheDocument();
}, 10000);
