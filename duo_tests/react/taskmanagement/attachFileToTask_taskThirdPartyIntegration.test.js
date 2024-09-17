import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask_taskApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should attach a file to task successfully.', async () => {
  fetchMock.post('/api/attachFile', { status: 200, body: { taskId: 1, fileUrl: 'http://example.com/file.png' }});
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when attaching file fails.', async () => {
  fetchMock.post('/api/attachFile', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('Failed to attach file.')).toBeInTheDocument();
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