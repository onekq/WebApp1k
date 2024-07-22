import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTaskToProject';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should assign task to a project successfully.', async () => {
  fetchMock.post('/api/assignTask', { status: 200, body: { taskId: 1, projectId: 1 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('project-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls('/api/assignTask')).toHaveLength(1);
  expect(screen.getByText('Task assigned successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to assign task.', async () => {
  fetchMock.post('/api/assignTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('project-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls('/api/assignTask')).toHaveLength(1);
  expect(screen.getByText('Failed to assign task.')).toBeInTheDocument();
}, 10000);
  