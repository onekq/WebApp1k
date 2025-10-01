import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCommentToTask_reopenTask_taskSortDueDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should add a comment to task successfully.', async () => {
  fetchMock.post('/api/addComment', { status: 200, body: { taskId: 1, comment: 'New comment' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'New comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Comment')); });

  expect(fetchMock.calls('/api/addComment')).toHaveLength(1);
  expect(screen.getByText('Comment added!')).toBeInTheDocument();
}, 10000);

test('should display error when adding comment fails.', async () => {
  fetchMock.post('/api/addComment', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Comment')); });

  expect(fetchMock.calls('/api/addComment')).toHaveLength(1);
  expect(screen.getByText('Failed to add comment.')).toBeInTheDocument();
}, 10000);

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

test('Sort tasks by due date successfully.', async () => {
  fetchMock.get('/api/tasks?sort=dueDate', {
    tasks: [
      { id: 4, title: 'Task 4', dueDate: '2023-10-09' },
      { id: 5, title: 'Task 5', dueDate: '2023-10-10' },
    ],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'dueDate' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 4')).toBeInTheDocument();
  expect(screen.getByText('Task 5')).toBeInTheDocument();
}, 10000);

test('Fail to sort tasks by due date when API returns 500.', async () => {
  fetchMock.get('/api/tasks?sort=dueDate', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'dueDate' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort tasks.')).toBeInTheDocument();
}, 10000);
