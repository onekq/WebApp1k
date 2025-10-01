import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './archiveArticle_inAppNotifications_ticketStatusChange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully archives articles', async () => {
  fetchMock.post('path/to/api/article/archive', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('archive-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to archive articles with error message', async () => {
  fetchMock.post('path/to/api/article/archive', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('archive-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
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

test('successfully changes the status of a ticket', async () => {
  fetchMock.put('/api/tickets/1/status', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketStatusChange ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Status updated successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if changing status fails', async () => {
  fetchMock.put('/api/tickets/1/status', 500);
  
  await act(async () => { render(<MemoryRouter><TicketStatusChange ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Failed to update status')).toBeInTheDocument();
}, 10000);
