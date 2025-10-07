import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTemplates_ticketEscalation_ticketComments_ticketSorting';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully configures auto-response templates. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Template saved')).toBeInTheDocument();
}, 10000);

test('Fails to configure auto-response templates. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save template')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show success message. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/escalate-ticket', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalated successfully')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show error message when failed. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/escalate-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalation failed')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show success message. (from ticketComments_ticketSorting)', async () => {
  fetchMock.post('/api/add-comment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show error message when failed. (from ticketComments_ticketSorting)', async () => {
  fetchMock.post('/api/add-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment addition failed')).toBeInTheDocument();
}, 10000);

test('sorts tickets by submission date (from ticketComments_ticketSorting)', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', { status: 200, body: [{ id: 2, date: '2023-01-01' }, { id: 1, date: '2023-01-02' }] });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  expect(screen.getByText('2023-01-02')).toBeInTheDocument();
}, 10000);

test('shows error if sorting tickets fails (from ticketComments_ticketSorting)', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('Failed to sort tickets')).toBeInTheDocument();
}, 10000);

