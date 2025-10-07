import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTemplates_ticketEscalation_customReportSharing_ticketListDisplay';

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

test('Successfully shares custom reports. (from customReportSharing_ticketListDisplay)', async () => {
  fetchMock.post('/api/report/custom/share', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-email-input'), { target: { value: 'user@test.com' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Report shared')).toBeInTheDocument();
}, 10000);

test('Fails to share custom reports and shows error message. (from customReportSharing_ticketListDisplay)', async () => {
  fetchMock.post('/api/report/custom/share', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-email-input'), { target: { value: 'user@test.com' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('displays a list of tickets with their current status (from customReportSharing_ticketListDisplay)', async () => {
  fetchMock.get('/api/tickets', { status: 200, body: [{ id: 1, status: 'Open' }, { id: 2, status: 'Resolved' }] });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('Resolved')).toBeInTheDocument();
}, 10000);

test('shows error if fetching ticket list fails (from customReportSharing_ticketListDisplay)', async () => {
  fetchMock.get('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to fetch ticket list')).toBeInTheDocument();
}, 10000);

