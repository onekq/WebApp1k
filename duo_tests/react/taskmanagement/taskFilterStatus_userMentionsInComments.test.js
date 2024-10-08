import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskFilterStatus_userMentionsInComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter tasks by status successfully.', async () => {
  fetchMock.get('/api/tasks?status=completed', {
    tasks: [{ id: 1, title: 'Task 1', status: 'completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by status'), { target: { value: 'completed' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 1')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by status when API returns 500.', async () => {
  fetchMock.get('/api/tasks?status=completed', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by status'), { target: { value: 'completed' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
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