import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCommentToTask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should add a comment to task successfully.', async () => {
  fetchMock.post('/api/addComment', { status: 200, body: { taskId: 1, comment: 'New comment' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'New comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Comment')); });

  expect(fetchMock.calls('/api/addComment')).toHaveLength(1);
  expect(screen.getByText('Comment added!')).toBeInTheDocument();
}, 10000);

test('should display error when adding comment fails.', async () => {
  fetchMock.post('/api/addComment', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Comment')); });

  expect(fetchMock.calls('/api/addComment')).toHaveLength(1);
  expect(screen.getByText('Failed to add comment.')).toBeInTheDocument();
}, 10000);

