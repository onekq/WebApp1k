import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectArchiving_taskSlaManagement_taskThirdPartyIntegration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Archive Project - success', async () => {
  fetchMock.post('/api/projects/archive', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/project archived successfully/i)).toBeInTheDocument();
}, 10000);

test('Archive Project - failure', async () => {
  fetchMock.post('/api/projects/archive', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/failed to archive project/i)).toBeInTheDocument();
}, 10000);

test('successfully sets SLAs for tasks.', async () => {
  fetchMock.post('/api/task-sla', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('SLAs set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set SLAs for tasks if server error.', async () => {
  fetchMock.post('/api/task-sla', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set SLAs')).toBeInTheDocument();
}, 10000);

test('successfully syncs tasks with a third-party tool.', async () => {
  fetchMock.post('/api/third-party-sync', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tool-input'), { target: { value: 'Jira' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-tool-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks synced with third-party tool successfully')).toBeInTheDocument();
}, 10000);

test('fails to sync tasks with a third-party tool if server error.', async () => {
  fetchMock.post('/api/third-party-sync', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tool-input'), { target: { value: 'Jira' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-tool-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sync with third-party tool')).toBeInTheDocument();
}, 10000);
