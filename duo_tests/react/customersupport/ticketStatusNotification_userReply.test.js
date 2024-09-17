import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './ticketStatusNotification_userReply';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('notifies the user of a ticket status change', async () => {
  fetchMock.put('/api/tickets/1/notify', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify')); });
  
  expect(fetchMock.calls('/api/tickets/1/notify').length).toBe(1);
  expect(screen.getByText('User notified successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if notification fails', async () => {
  fetchMock.put('/api/tickets/1/notify', 500);
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify')); });
  
  expect(fetchMock.calls('/api/tickets/1/notify').length).toBe(1);
  expect(screen.getByText('Failed to notify user')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show success message.', async () => {
  fetchMock.post('/api/user-reply', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submitted successfully')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show error message when failed.', async () => {
  fetchMock.post('/api/user-reply', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submission failed')).toBeInTheDocument();
}, 10000);