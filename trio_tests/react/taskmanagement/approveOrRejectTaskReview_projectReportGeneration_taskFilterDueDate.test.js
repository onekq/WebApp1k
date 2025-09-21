import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './approveOrRejectTaskReview_projectReportGeneration_taskFilterDueDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Approve a task review successfully', async () => {
  fetchMock.post('/approve-review', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('approve-review-button')); });

  expect(fetchMock.calls('/approve-review').length).toBe(1);
  expect(screen.getByText('Review approved successfully')).toBeInTheDocument();
}, 10000);

test('Fail to approve a task review due to server error', async () => {
  fetchMock.post('/approve-review', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('approve-review-button')); });

  expect(fetchMock.calls('/approve-review').length).toBe(1);
  expect(screen.getByText('Error approving review')).toBeInTheDocument();
}, 10000);

test('Generate Project Report - success', async () => {
  fetchMock.get('/api/projects/report', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /generate report/i }));
  });

  expect(fetchMock.calls('/api/projects/report')).toHaveLength(1);
  expect(screen.getByText(/project report/i)).toBeInTheDocument();
}, 10000);

test('Generate Project Report - failure', async () => {
  fetchMock.get('/api/projects/report', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /generate report/i }));
  });

  expect(fetchMock.calls('/api/projects/report')).toHaveLength(1);
  expect(screen.getByText(/failed to generate report/i)).toBeInTheDocument();
}, 10000);

test('Filter tasks by due date successfully.', async () => {
  fetchMock.get('/api/tasks?dueDate=2023-10-10', {
    tasks: [{ id: 2, title: 'Task 2', dueDate: '2023-10-10' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by due date'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 2')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by due date when API returns 500.', async () => {
  fetchMock.get('/api/tasks?dueDate=2023-10-10', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by due date'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);
