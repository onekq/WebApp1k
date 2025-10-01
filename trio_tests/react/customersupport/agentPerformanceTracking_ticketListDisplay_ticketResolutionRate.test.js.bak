import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentPerformanceTracking_ticketListDisplay_ticketResolutionRate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully tracks agent performance metrics.', async () => {
  fetchMock.post('/api/report/agent-performance', {
    status: 200,
    body: { success: true, data: { performance: 'good' }},
  });

  await act(async () => {
    render(<MemoryRouter><AgentPerformanceTracking /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent2' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-performance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Performance: good')).toBeInTheDocument();
}, 10000);

test('Fails to track agent performance metrics and shows error message.', async () => {
  fetchMock.post('/api/report/agent-performance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><AgentPerformanceTracking /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent2' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-performance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('displays a list of tickets with their current status', async () => {
  fetchMock.get('/api/tickets', { status: 200, body: [{ id: 1, status: 'Open' }, { id: 2, status: 'Resolved' }] });
  
  await act(async () => { render(<MemoryRouter><TicketListDisplay /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('Resolved')).toBeInTheDocument();
}, 10000);

test('shows error if fetching ticket list fails', async () => {
  fetchMock.get('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketListDisplay /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to fetch ticket list')).toBeInTheDocument();
}, 10000);

test('Successfully reports on ticket resolution rates.', async () => {
  fetchMock.post('/api/report/resolution-rate', {
    status: 200,
    body: { success: true, data: { resolutionRate: 0.75 }},
  });

  await act(async () => {
    render(<MemoryRouter><ResolutionRateReporting /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-02-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-resolution-rate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resolution Rate: 75%')).toBeInTheDocument();
}, 10000);

test('Fails to report on ticket resolution rates and shows error message.', async () => {
  fetchMock.post('/api/report/resolution-rate', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><ResolutionRateReporting /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-02-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-resolution-rate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
