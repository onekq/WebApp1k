import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskSlaManagement_taskThirdPartyIntegration_projectCreation_viewTaskHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sets SLAs for tasks. (from taskSlaManagement_taskThirdPartyIntegration)', async () => {
  fetchMock.post('/api/task-sla', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('SLAs set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set SLAs for tasks if server error. (from taskSlaManagement_taskThirdPartyIntegration)', async () => {
  fetchMock.post('/api/task-sla', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set SLAs')).toBeInTheDocument();
}, 10000);

test('successfully syncs tasks with a third-party tool. (from taskSlaManagement_taskThirdPartyIntegration)', async () => {
  fetchMock.post('/api/third-party-sync', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tool-input'), { target: { value: 'Jira' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-tool-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks synced with third-party tool successfully')).toBeInTheDocument();
}, 10000);

test('fails to sync tasks with a third-party tool if server error. (from taskSlaManagement_taskThirdPartyIntegration)', async () => {
  fetchMock.post('/api/third-party-sync', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tool-input'), { target: { value: 'Jira' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-tool-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sync with third-party tool')).toBeInTheDocument();
}, 10000);

test('Create Project - success (from projectCreation_viewTaskHistory)', async () => {
  fetchMock.post('/api/projects', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/project created successfully/i)).toBeInTheDocument();
}, 10000);

test('Create Project - failure (from projectCreation_viewTaskHistory)', async () => {
  fetchMock.post('/api/projects', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
}, 10000);

test('View change history of a task successfully. (from projectCreation_viewTaskHistory)', async () => {
  fetchMock.get('/api/tasks/1/history', {
    history: [{ change: 'Changed status to completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Changed status to completed')).toBeInTheDocument();
}, 10000);

test('Fail to view change history of a task when API returns 500. (from projectCreation_viewTaskHistory)', async () => {
  fetchMock.get('/api/tasks/1/history', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history.')).toBeInTheDocument();
}, 10000);

