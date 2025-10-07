import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './approveOrRejectTaskReview_setTaskPriority_taskResourcesAllocation_taskSortDueDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Approve a task review successfully (from approveOrRejectTaskReview_setTaskPriority)', async () => {
  fetchMock.post('/approve-review', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('approve-review-button')); });

  expect(fetchMock.calls('/approve-review').length).toBe(1);
  expect(screen.getByText('Review approved successfully')).toBeInTheDocument();
}, 10000);

test('Fail to approve a task review due to server error (from approveOrRejectTaskReview_setTaskPriority)', async () => {
  fetchMock.post('/approve-review', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('approve-review-button')); });

  expect(fetchMock.calls('/approve-review').length).toBe(1);
  expect(screen.getByText('Error approving review')).toBeInTheDocument();
}, 10000);

test('should set task priority successfully. (from approveOrRejectTaskReview_setTaskPriority)', async () => {
  fetchMock.post('/api/setPriority', { status: 200, body: { taskId: 1, priority: 'High' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('priority-select'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Set Priority')); });

  expect(fetchMock.calls('/api/setPriority')).toHaveLength(1);
  expect(screen.getByText('Task priority updated!')).toBeInTheDocument();
}, 10000);

test('should display error when setting task priority fails. (from approveOrRejectTaskReview_setTaskPriority)', async () => {
  fetchMock.post('/api/setPriority', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('priority-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Set Priority')); });

  expect(fetchMock.calls('/api/setPriority')).toHaveLength(1);
  expect(screen.getByText('Failed to set task priority.')).toBeInTheDocument();
}, 10000);

test('successfully allocates resources to a task. (from taskResourcesAllocation_taskSortDueDate)', async () => {
  fetchMock.post('/api/resource-allocation', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Resource allocated successfully')).toBeInTheDocument();
}, 10000);

test('fails to allocate resources to a task if server error. (from taskResourcesAllocation_taskSortDueDate)', async () => {
  fetchMock.post('/api/resource-allocation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to allocate resource')).toBeInTheDocument();
}, 10000);

test('Sort tasks by due date successfully. (from taskResourcesAllocation_taskSortDueDate)', async () => {
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

test('Fail to sort tasks by due date when API returns 500. (from taskResourcesAllocation_taskSortDueDate)', async () => {
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

