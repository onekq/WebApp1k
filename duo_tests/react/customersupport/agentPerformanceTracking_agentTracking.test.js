import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentPerformanceTracking_agentTracking';

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
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('Tracking the agent assigned to a ticket should show agent name.', async () => {
  fetchMock.post('/api/track-agent', { agent: 'James Bond' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Assigned to: James Bond')).toBeInTheDocument();
}, 10000);

test('Tracking the agent assigned to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/track-agent', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Agent tracking failed')).toBeInTheDocument();
}, 10000);