import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentPerformanceTracking_slaBreachNotification_ticketVolume';

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

test('Successfully notifies agents of SLA breaches.', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><SLABreachNotification /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-breach-picker'), { target: { value: 'breach1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-sla-breach'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify agents of SLA breaches and shows error message.', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><SLABreachNotification /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-breach-picker'), { target: { value: 'breach1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-sla-breach'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully generates reports on ticket volume.', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><TicketVolume /></MemoryRouter>);
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

test('Fails to generate reports on ticket volume and shows error message.', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><TicketVolume /></MemoryRouter>);
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
