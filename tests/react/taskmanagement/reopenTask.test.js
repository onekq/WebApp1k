import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reopenTask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should reopen a completed task successfully.', async () => {
  fetchMock.post('/api/reopenTask', { status: 200, body: { taskId: 1, completed: false }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reopen-task-button')); });

  expect(fetchMock.calls('/api/reopenTask')).toHaveLength(1);
  expect(screen.getByText('Task reopened!')).toBeInTheDocument();
}, 10000);

test('should display error when reopening task fails.', async () => {
  fetchMock.post('/api/reopenTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reopen-task-button')); });

  expect(fetchMock.calls('/api/reopenTask')).toHaveLength(1);
  expect(screen.getByText('Failed to reopen task.')).toBeInTheDocument();
}, 10000);

