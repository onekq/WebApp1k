import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './responseHistory_ticketAssignment_autoResponseTracking_ticketVolume';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Tracking the history of responses should show response history. (from responseHistory_ticketAssignment)', async () => {
  fetchMock.get('/api/response-history', { history: ['Initial response', 'Follow-up response'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Initial response')).toBeInTheDocument();
}, 10000);

test('Tracking the history of responses should show error message when failed. (from responseHistory_ticketAssignment)', async () => {
  fetchMock.get('/api/response-history', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Failed to retrieve response history')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show success message. (from responseHistory_ticketAssignment)', async () => {
  fetchMock.post('/api/assign-ticket', { agent: 'John Doe' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Assignment to John Doe successful')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show error message when failed. (from responseHistory_ticketAssignment)', async () => {
  fetchMock.post('/api/assign-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket assignment failed')).toBeInTheDocument();
}, 10000);

test('Successfully tracks the use of auto-responses. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Successfully generates reports on ticket volume. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-result')).toBeInTheDocument();
}, 10000);

test('Fails to generate reports on ticket volume and shows error message. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

