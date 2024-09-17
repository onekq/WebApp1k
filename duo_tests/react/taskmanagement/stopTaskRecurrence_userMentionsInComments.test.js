import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './stopApp_userMentionsInComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully stops task recurrence.', async () => {
  fetchMock.post('/api/stop-task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence stopped successfully')).toBeInTheDocument();
}, 10000);

test('fails to stop task recurrence if server error.', async () => {
  fetchMock.post('/api/stop-task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to stop recurrence')).toBeInTheDocument();
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