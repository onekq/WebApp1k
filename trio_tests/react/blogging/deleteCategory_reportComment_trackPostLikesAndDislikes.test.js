import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteCategory_reportComment_trackPostLikesAndDislikes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can delete a category successfully', async () => {
  fetchMock.delete('/categories/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a category fails', async () => {
  fetchMock.delete('/categories/1', {
    status: 500,
    body: { error: 'Unable to delete category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete category')).toBeInTheDocument();
}, 10000);

test('successfully reports a comment', async () => {
  fetchMock.post('/api/comments/report/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Comment reported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to report a comment', async () => {
  fetchMock.post('/api/comments/report/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Failed to report comment/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks post likes and dislikes', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostLikesDislikes')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Likes: 1')).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByText('Dislike Post')); });
  expect(screen.getByText('Dislikes: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post likes and dislikes with an error message', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(screen.getByText('Error tracking likes and dislikes')).toBeInTheDocument();
}, 10000);
