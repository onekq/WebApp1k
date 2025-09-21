import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTracking_ticketEscalation_ticketStatusFilter';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully tracks the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><AutoResponseTracking /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><AutoResponseTracking /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show success message.', async () => {
  fetchMock.post('/api/escalate-ticket', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalated successfully')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show error message when failed.', async () => {
  fetchMock.post('/api/escalate-ticket', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalation failed')).toBeInTheDocument();
}, 10000);

test('filters tickets by status', async () => {
  fetchMock.get('/api/tickets?status=Open', { status: 200, body: [{ id: 1, status: 'Open' }] });
  
  await act(async () => { render(<MemoryRouter><TicketStatusFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status Filter'), { target: { value: 'Open' } }); });
  
  expect(fetchMock.calls('/api/tickets?status=Open').length).toBe(1);
  expect(screen.getByText('Open')).toBeInTheDocument();
}, 10000);

test('shows error if filtering tickets fails', async () => {
  fetchMock.get('/api/tickets?status=Open', 500);
  
  await act(async () => { render(<MemoryRouter><TicketStatusFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status Filter'), { target: { value: 'Open' } }); });
  
  expect(fetchMock.calls('/api/tickets?status=Open').length).toBe(1);
  expect(screen.getByText('Failed to filter tickets')).toBeInTheDocument();
}, 10000);
