import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskCompletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should mark task as completed successfully.', async () => {
  fetchMock.post('/api/markComplete', { status: 200, body: { taskId: 1, completed: true }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('complete-task-button')); });

  expect(fetchMock.calls('/api/markComplete')).toHaveLength(1);
  expect(screen.getByText('Task marked as completed!')).toBeInTheDocument();
}, 10000);

test('should show error when failing to mark task as completed.', async () => {
  fetchMock.post('/api/markComplete', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('complete-task-button')); });

  expect(fetchMock.calls('/api/markComplete')).toHaveLength(1);
  expect(screen.getByText('Failed to mark task as completed.')).toBeInTheDocument();
}, 10000);

