import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeeDetailUpdate_eventAccessibilityOptions_eventNotifications';

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

test('Displays event accessibility options', async () => {
  fetchMock.get('/api/event/accessibility', { wheelchairAccess: true, signLanguageInterpreter: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Wheelchair access')).toBeInTheDocument();
  expect(screen.getByText('Sign language interpreter')).toBeInTheDocument();
}, 10000);

test('Displays error message when accessibility options are unavailable', async () => {
  fetchMock.get('/api/event/accessibility', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Accessibility options are unavailable')).toBeInTheDocument();
}, 10000);

test('Displays success message upon sending event notifications', async () => {
  fetchMock.post('/api/event/notify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event notifications sent successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to send event notifications', async () => {
  fetchMock.post('/api/event/notify', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send event notifications')).toBeInTheDocument();
}, 10000);
