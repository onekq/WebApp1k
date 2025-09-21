import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './emailNotifications_internalNotes_ticketReassignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully sends email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 200);

  await act(async () => { render(<MemoryRouter><EmailNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 500);

  await act(async () => { render(<MemoryRouter><EmailNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send notification')).toBeInTheDocument();
}, 10000);

test('Adding internal notes to tickets should show success message.', async () => {
  fetchMock.post('/api/add-internal-note', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note added successfully')).toBeInTheDocument();
}, 10000);

test('Adding internal notes to tickets should show error message when failed.', async () => {
  fetchMock.post('/api/add-internal-note', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note addition failed')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show success message.', async () => {
  fetchMock.post('/api/reassign-ticket', { agent: 'Jane Doe' });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Reassigned to Jane Doe successfully')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show error message when failed.', async () => {
  fetchMock.post('/api/reassign-ticket', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket reassignment failed')).toBeInTheDocument();
}, 10000);
