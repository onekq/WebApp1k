import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationsForUsers_taskImportFromCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set custom notification preferences successfully', async () => {
  fetchMock.post('/set-notifications', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Notifications set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set custom notification preferences due to server error', async () => {
  fetchMock.post('/set-notifications', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Error setting notifications')).toBeInTheDocument();
}, 10000);

test('successfully imports tasks from a CSV file.', async () => {
  fetchMock.post('/api/import-tasks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('csv-file-input'), { target: { files: [new File(['Task data'], 'tasks.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks imported successfully')).toBeInTheDocument();
}, 10000);

test('fails to import tasks from a CSV file if server error.', async () => {
  fetchMock.post('/api/import-tasks', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('csv-file-input'), { target: { files: [new File(['Task data'], 'tasks.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to import tasks')).toBeInTheDocument();
}, 10000);