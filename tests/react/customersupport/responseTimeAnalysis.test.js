import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ResponseTimeAnalysis from './responseTimeAnalysis';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully analyzes average response time.', async () => {
  fetchMock.post('/api/report/response-time', {
    status: 200,
    body: { success: true, data: { avgResponseTime: 120 }},
  });

  await act(async () => {
    render(<MemoryRouter><ResponseTimeAnalysis /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('analyze-response-time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average Response Time: 120')).toBeInTheDocument();
}, 10000);

test('Fails to analyze average response time and shows error message.', async () => {
  fetchMock.post('/api/report/response-time', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><ResponseTimeAnalysis /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('analyze-response-time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

