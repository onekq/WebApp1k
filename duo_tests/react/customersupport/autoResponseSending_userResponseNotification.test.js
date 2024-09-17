import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseSending_userResponseNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Auto-response sent')).toBeInTheDocument();
}, 10000);

test('Fails to send auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send auto-response')).toBeInTheDocument();
}, 10000);

test('Notifying user of agent response should show success message.', async () => {
  fetchMock.post('/api/notify-user', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notification-user'), { target: { value: 'User123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-notification')); });

  expect(fetchMock.calls('/api/notify-user').length).toBe(1);
  expect(screen.getByText('User notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying user of agent response should show error message when failed.', async () => {
  fetchMock.post('/api/notify-user', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notification-user'), { target: { value: 'User123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-notification')); });

  expect(fetchMock.calls('/api/notify-user').length).toBe(1);
  expect(screen.getByText('User notification failed')).toBeInTheDocument();
}, 10000);