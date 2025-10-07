import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventArchiving_validateMaximumAttendees_groupRegistrations_validateAgendaItemCategorization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon event archiving (from eventArchiving_validateMaximumAttendees)', async () => {
  fetchMock.post('/api/event/archive', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('archive-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event archived successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to archive event (from eventArchiving_validateMaximumAttendees)', async () => {
  fetchMock.post('/api/event/archive', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('archive-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to archive the event')).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid maximum attendees count (from eventArchiving_validateMaximumAttendees)', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for negative maximum attendees count (from eventArchiving_validateMaximumAttendees)', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/maximum attendees must be a positive number/i)).toBeInTheDocument();
}, 10000);

test('Group registrations are successfully supported (from groupRegistrations_validateAgendaItemCategorization)', async () => {
  fetchMock.post('/register-group', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group registration successful/i)).toBeInTheDocument();
}, 10000);

test('Group registration fails if exceeding max group size (from groupRegistrations_validateAgendaItemCategorization)', async () => {
  fetchMock.post('/register-group', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '20' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group size exceeds limit/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates agenda item categorization. (from groupRegistrations_validateAgendaItemCategorization)', async () => {
  fetchMock.post('/api/validateAgendaItemCategorization', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-categorization-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Agenda item categorized')).toBeInTheDocument();
}, 10000);

test('Fails to validate agenda item categorization. (from groupRegistrations_validateAgendaItemCategorization)', async () => {
  fetchMock.post('/api/validateAgendaItemCategorization', { error: 'Failed to categorize agenda item' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-categorization-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to categorize agenda item')).toBeInTheDocument();
}, 10000);

