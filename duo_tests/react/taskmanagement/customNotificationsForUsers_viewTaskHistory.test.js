import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationsForUsers_viewApp';

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