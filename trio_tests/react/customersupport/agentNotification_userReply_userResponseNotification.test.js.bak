import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentNotification_userReply_userResponseNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Notifying agent of new ticket assignment should show success message.', async () => {
  fetchMock.post('/api/notify-agent', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-agent')); });

  expect(fetchMock.calls('/api/notify-agent').length).toBe(1);
  expect(screen.getByText('Agent notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying agent of new ticket assignment should show error message when failed.', async () => {
  fetchMock.post('/api/notify-agent', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-agent')); });

  expect(fetchMock.calls('/api/notify-agent').length).toBe(1);
  expect(screen.getByText('Agent notification failed')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show success message.', async () => {
  fetchMock.post('/api/user-reply', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submitted successfully')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show error message when failed.', async () => {
  fetchMock.post('/api/user-reply', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submission failed')).toBeInTheDocument();
}, 10000);

test('Notifying user of agent response should show success message.', async () => {
  fetchMock.post('/api/notify-user', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notification-user'), { target: { value: 'User123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-notification')); });

  expect(fetchMock.calls('/api/notify-user').length).toBe(1);
  expect(screen.getByText('User notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying user of agent response should show error message when failed.', async () => {
  fetchMock.post('/api/notify-user', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notification-user'), { target: { value: 'User123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-notification')); });

  expect(fetchMock.calls('/api/notify-user').length).toBe(1);
  expect(screen.getByText('User notification failed')).toBeInTheDocument();
}, 10000);
