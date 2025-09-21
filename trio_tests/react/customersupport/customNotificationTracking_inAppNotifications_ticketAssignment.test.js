import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationTracking_inAppNotifications_ticketAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully tracks custom notification delivery.', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', { deliveryStatus: 'Success' });

  await act(async () => { render(<MemoryRouter><CustomNotificationTracking /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Success')).toBeInTheDocument();
}, 10000);

test('Fails to track custom notification delivery.', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', 500);

  await act(async () => { render(<MemoryRouter><CustomNotificationTracking /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery')).toBeInTheDocument();
}, 10000);

test('Successfully displays in-app notifications.', async () => {
  fetchMock.get('/api/getNotifications', { notifications: ['Notification 1'] });

  await act(async () => { render(<MemoryRouter><InAppNotifications /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification 1')).toBeInTheDocument();
}, 10000);

test('Fails to display in-app notifications.', async () => {
  fetchMock.get('/api/getNotifications', 500);

  await act(async () => { render(<MemoryRouter><InAppNotifications /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show success message.', async () => {
  fetchMock.post('/api/assign-ticket', { agent: 'John Doe' });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Assignment to John Doe successful')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show error message when failed.', async () => {
  fetchMock.post('/api/assign-ticket', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket assignment failed')).toBeInTheDocument();
}, 10000);
