import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TicketStatusNotification from './ticketStatusNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

