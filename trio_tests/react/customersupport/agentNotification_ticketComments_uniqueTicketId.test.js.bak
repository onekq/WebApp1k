import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentNotification_ticketComments_uniqueTicketId';

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

test('Adding comments to a ticket should show success message.', async () => {
  fetchMock.post('/api/add-comment', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/add-comment', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment addition failed')).toBeInTheDocument();
}, 10000);

test('assigns a unique ID to each new ticket', async () => {
  fetchMock.post('/api/tickets', { id: '12345' });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket ID: 12345')).toBeInTheDocument();
}, 10000);

test('fails to assign a unique ID if submission fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.queryByText('Ticket ID:')).not.toBeInTheDocument();
}, 10000);
