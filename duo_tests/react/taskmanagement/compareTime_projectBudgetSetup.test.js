import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareTime_projectBudgetSetup';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Compare estimated time to actual time spent on a task successfully.', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', {
    comparison: { estimated: 5, actual: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Estimated: 5 hours')).toBeInTheDocument();
  expect(screen.getByText('Actual: 3 hours')).toBeInTheDocument();
}, 10000);

test('Fail to compare estimated time to actual time spent on a task when API returns 500.', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load time comparison.')).toBeInTheDocument();
}, 10000);

test('Set Project Budget - success', async () => {
  fetchMock.post('/api/projects/budget', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/budget set successfully/i)).toBeInTheDocument();
}, 10000);

test('Set Project Budget - failure', async () => {
  fetchMock.post('/api/projects/budget', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/failed to set budget/i)).toBeInTheDocument();
}, 10000);