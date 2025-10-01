import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './changeTaskDeadline_logTime_viewUserPerformanceMetrics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Change the due date of an existing task successfully.', async () => {
  fetchMock.put('/api/tasks/1/deadline', {
    task: { id: 1, title: 'Task 1', dueDate: '2023-10-11' },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Change deadline'), { target: { value: '2023-10-11' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Update Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-11')).toBeInTheDocument();
}, 10000);

test('Fail to change the due date of an existing task when API returns 500.', async () => {
  fetchMock.put('/api/tasks/1/deadline', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Change deadline'), { target: { value: '2023-10-11' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Update Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to change deadline.')).toBeInTheDocument();
}, 10000);

test('Log time spent on a task successfully.', async () => {
  fetchMock.post('/api/tasks/1/time', {
    timeLog: { id: 1, taskId: 1, hours: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Log time'), { target: { value: '3' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Log Time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('3 hours logged')).toBeInTheDocument();
}, 10000);

test('Fail to log time spent on a task when API returns 500.', async () => {
  fetchMock.post('/api/tasks/1/time', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Log time'), { target: { value: '3' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Log Time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log time.')).toBeInTheDocument();
}, 10000);

test('View user performance metrics successfully', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 200, body: { metrics: { tasksCompleted: 5 } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Tasks completed: 5')).toBeInTheDocument();
}, 10000);

test('Fail to view user performance metrics due to server error', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 500, body: { metrics: null } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Error fetching performance metrics')).toBeInTheDocument();
}, 10000);
