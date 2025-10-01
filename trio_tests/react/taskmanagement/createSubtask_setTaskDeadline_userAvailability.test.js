import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createSubtask_setTaskDeadline_userAvailability';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should create a subtask under a parent task successfully.', async () => {
  fetchMock.post('/api/createSubtask', { status: 201, body: { id: 2, parentId: 1, title: 'New Subtask' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Subtask Title'), { target: { value: 'New Subtask' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Subtask')); });

  expect(fetchMock.calls('/api/createSubtask')).toHaveLength(1);
  expect(screen.getByText('Subtask created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when creating subtask fails.', async () => {
  fetchMock.post('/api/createSubtask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Subtask Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Subtask')); });

  expect(fetchMock.calls('/api/createSubtask')).toHaveLength(1);
  expect(screen.getByText('Failed to create subtask.')).toBeInTheDocument();
}, 10000);

test('Set a due date for a task successfully.', async () => {
  fetchMock.post('/api/tasks/1/deadline', {
    task: { id: 1, title: 'Task 1', dueDate: '2023-10-10' },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Set deadline'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-10')).toBeInTheDocument();
}, 10000);

test('Fail to set a due date for a task when API returns 500.', async () => {
  fetchMock.post('/api/tasks/1/deadline', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Set deadline'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set deadline.')).toBeInTheDocument();
}, 10000);

test('Set user availability successfully', async () => {
  fetchMock.post('/set-availability', { status: 200, body: { available: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('availability-toggle')); });

  expect(fetchMock.calls('/set-availability').length).toBe(1);
  expect(screen.getByText('Availability set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set user availability due to server error', async () => {
  fetchMock.post('/set-availability', { status: 500, body: { available: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('availability-toggle')); });

  expect(fetchMock.calls('/set-availability').length).toBe(1);
  expect(screen.getByText('Error setting availability')).toBeInTheDocument();
}, 10000);
