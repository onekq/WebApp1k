import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './slaPerformanceReporting_ticketReassignment_ticketStatusChange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully reports on SLA performance.', async () => {
  fetchMock.post('/api/report/sla-performance', {
    status: 200,
    body: { success: true, data: { slaPerformance: 'Good' }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-picker'), { target: { value: 'sla1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-sla-performance-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SLA Performance: Good')).toBeInTheDocument();
}, 10000);

test('Fails to report on SLA performance and shows error message.', async () => {
  fetchMock.post('/api/report/sla-performance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-picker'), { target: { value: 'sla1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-sla-performance-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show success message.', async () => {
  fetchMock.post('/api/reassign-ticket', { agent: 'Jane Doe' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Reassigned to Jane Doe successfully')).toBeInTheDocument();
}, 10000);

test('Reassigning ticket to a different agent should show error message when failed.', async () => {
  fetchMock.post('/api/reassign-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('reassign-ticket')); });

  expect(fetchMock.calls('/api/reassign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket reassignment failed')).toBeInTheDocument();
}, 10000);

test('successfully changes the status of a ticket', async () => {
  fetchMock.put('/api/tickets/1/status', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Status updated successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if changing status fails', async () => {
  fetchMock.put('/api/tickets/1/status', 500);
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Failed to update status')).toBeInTheDocument();
}, 10000);
