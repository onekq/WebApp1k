import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './requestTaskReview_taskPermissions_viewTaskHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Request a review successfully', async () => {
  fetchMock.post('/request-review', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('request-review-button')); });

  expect(fetchMock.calls('/request-review').length).toBe(1);
  expect(screen.getByText('Review requested successfully')).toBeInTheDocument();
}, 10000);

test('Fail to request a review due to server error', async () => {
  fetchMock.post('/request-review', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('request-review-button')); });

  expect(fetchMock.calls('/request-review').length).toBe(1);
  expect(screen.getByText('Error requesting review')).toBeInTheDocument();
}, 10000);

test('Set task-specific permissions for users successfully', async () => {
  fetchMock.post('/set-task-permissions', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('permission-select'), { target: { value: 'edit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-permission-button')); });

  expect(fetchMock.calls('/set-task-permissions').length).toBe(1);
  expect(screen.getByText('Permissions set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set task-specific permissions for users due to server error', async () => {
  fetchMock.post('/set-task-permissions', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('permission-select'), { target: { value: 'edit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-permission-button')); });

  expect(fetchMock.calls('/set-task-permissions').length).toBe(1);
  expect(screen.getByText('Error setting permissions')).toBeInTheDocument();
}, 10000);

test('View change history of a task successfully.', async () => {
  fetchMock.get('/api/tasks/1/history', {
    history: [{ change: 'Changed status to completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Changed status to completed')).toBeInTheDocument();
}, 10000);

test('Fail to view change history of a task when API returns 500.', async () => {
  fetchMock.get('/api/tasks/1/history', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history.')).toBeInTheDocument();
}, 10000);
