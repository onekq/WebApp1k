import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TaskDependencies from './setTaskDependencies';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sets task dependencies.', async () => {
  fetchMock.post('/api/task-dependencies', { success: true });

  await act(async () => { render(<MemoryRouter><TaskDependencies /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Dependency set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set task dependencies if server error.', async () => {
  fetchMock.post('/api/task-dependencies', 500);

  await act(async () => { render(<MemoryRouter><TaskDependencies /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set dependencies')).toBeInTheDocument();
}, 10000);

