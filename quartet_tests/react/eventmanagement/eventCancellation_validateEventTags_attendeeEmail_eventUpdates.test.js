import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventCancellation_validateEventTags_attendeeEmail_eventUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays successful cancellation message upon event cancellation (from eventCancellation_validateEventTags)', async () => {
  fetchMock.post('/api/event/cancel', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancel-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event successfully cancelled')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to cancel an event (from eventCancellation_validateEventTags)', async () => {
  fetchMock.post('/api/event/cancel', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancel-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to cancel the event')).toBeInTheDocument();
}, 10000);

test('Should successfully add valid event tags (from eventCancellation_validateEventTags)', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tech, conference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for invalid event tag characters (from eventCancellation_validateEventTags)', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tech, con*ference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/invalid characters in tags/i)).toBeInTheDocument();
}, 10000);

test('Attendee email is successfully validated and submitted (from attendeeEmail_eventUpdates)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee email validation fails if format is incorrect (from attendeeEmail_eventUpdates)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'johnexample' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
}, 10000);

test('Displays success message upon successful event updates (from attendeeEmail_eventUpdates)', async () => {
  fetchMock.post('/api/event/update', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'New Title' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event updated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to update event (from attendeeEmail_eventUpdates)', async () => {
  fetchMock.post('/api/event/update', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'New Title' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update the event')).toBeInTheDocument();
}, 10000);

