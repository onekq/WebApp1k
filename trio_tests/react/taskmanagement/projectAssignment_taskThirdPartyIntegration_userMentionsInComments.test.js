import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectAssignment_taskThirdPartyIntegration_userMentionsInComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Assign Users to Project - success', async () => {
  fetchMock.post('/api/projects/assign-users', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/users assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('Assign Users to Project - failure', async () => {
  fetchMock.post('/api/projects/assign-users', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/failed to assign users/i)).toBeInTheDocument();
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

test('Mention user in a task comment successfully', async () => {
  fetchMock.post('/mention-user', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Hey @User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-comment-button')); });

  expect(fetchMock.calls('/mention-user').length).toBe(1);
  expect(screen.getByText('Mention added successfully')).toBeInTheDocument();
}, 10000);

test('Fail to mention user in a task comment due to server error', async () => {
  fetchMock.post('/mention-user', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Hey @User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-comment-button')); });

  expect(fetchMock.calls('/mention-user').length).toBe(1);
  expect(screen.getByText('Error adding mention')).toBeInTheDocument();
}, 10000);
