import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentTracking_notificationPreferences_ticketStatusNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Tracking the agent assigned to a ticket should show agent name.', async () => {
  fetchMock.post('/api/track-agent', { agent: 'James Bond' });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Assigned to: James Bond')).toBeInTheDocument();
}, 10000);

test('Tracking the agent assigned to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/track-agent', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Agent tracking failed')).toBeInTheDocument();
}, 10000);

test('Successfully customizes notification preferences.', async () => {
  fetchMock.post('/api/savePreferences', 200);

  await act(async () => { render(<MemoryRouter><NotificationPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('emailToggle'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferences saved')).toBeInTheDocument();
}, 10000);

test('Fails to customize notification preferences.', async () => {
  fetchMock.post('/api/savePreferences', 500);

  await act(async () => { render(<MemoryRouter><NotificationPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('emailToggle'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save preferences')).toBeInTheDocument();
}, 10000);

test('notifies the user of a ticket status change', async () => {
  fetchMock.put('/api/tickets/1/notify', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketStatusNotification ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify')); });
  
  expect(fetchMock.calls('/api/tickets/1/notify').length).toBe(1);
  expect(screen.getByText('User notified successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if notification fails', async () => {
  fetchMock.put('/api/tickets/1/notify', 500);
  
  await act(async () => { render(<MemoryRouter><TicketStatusNotification ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify')); });
  
  expect(fetchMock.calls('/api/tickets/1/notify').length).toBe(1);
  expect(screen.getByText('Failed to notify user')).toBeInTheDocument();
}, 10000);
