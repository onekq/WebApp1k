import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './inAppNotifications_ticketSubmission_notificationPreferences_ticketPrioritization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays in-app notifications. (from inAppNotifications_ticketSubmission)', async () => {
  fetchMock.get('/api/getNotifications', { notifications: ['Notification 1'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification 1')).toBeInTheDocument();
}, 10000);

test('Fails to display in-app notifications. (from inAppNotifications_ticketSubmission)', async () => {
  fetchMock.get('/api/getNotifications', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
}, 10000);

test('successfully submits a ticket with required fields filled (from inAppNotifications_ticketSubmission)', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error when submitting a ticket with missing fields (from inAppNotifications_ticketSubmission)', async () => {
  fetchMock.post('/api/tickets', { status: 400 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Title is required')).toBeInTheDocument();
}, 10000);

test('Successfully customizes notification preferences. (from notificationPreferences_ticketPrioritization)', async () => {
  fetchMock.post('/api/savePreferences', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('emailToggle'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferences saved')).toBeInTheDocument();
}, 10000);

test('Fails to customize notification preferences. (from notificationPreferences_ticketPrioritization)', async () => {
  fetchMock.post('/api/savePreferences', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('emailToggle'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save preferences')).toBeInTheDocument();
}, 10000);

test('successfully sets ticket priority (from notificationPreferences_ticketPrioritization)', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets')[0][1].body).toContain('High');
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if setting priority fails (from notificationPreferences_ticketPrioritization)', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to set ticket priority')).toBeInTheDocument();
}, 10000);

