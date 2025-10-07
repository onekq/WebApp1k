import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveCommentCount_trackPostViews_approveRejectComments_deleteCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully retrieves comment count for a post (from retrieveCommentCount_trackPostViews)', async () => {
  fetchMock.get('/api/comments/count?postId=1', { count: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/10 comments/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comment count for a post (from retrieveCommentCount_trackPostViews)', async () => {
  fetchMock.get('/api/comments/count?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comment count/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks post views (from retrieveCommentCount_trackPostViews)', async () => {
  fetchMock.post('/api/trackPostViews', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostViews')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Views: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post views with an error message (from retrieveCommentCount_trackPostViews)', async () => {
  fetchMock.post('/api/trackPostViews', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(screen.getByText('Error tracking views')).toBeInTheDocument();
}, 10000);

test('successfully approves a comment (from approveRejectComments_deleteCategory)', async () => {
  fetchMock.put('/api/comments/approve/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Approve/i)); });

  expect(fetchMock.calls('/api/comments/approve/1').length).toBe(1);
  expect(screen.getByText(/Comment approved successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to approve a comment (from approveRejectComments_deleteCategory)', async () => {
  fetchMock.put('/api/comments/approve/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Approve/i)); });

  expect(fetchMock.calls('/api/comments/approve/1').length).toBe(1);
  expect(screen.getByText(/Failed to approve comment/i)).toBeInTheDocument();
}, 10000);

test('User can delete a category successfully (from approveRejectComments_deleteCategory)', async () => {
  fetchMock.delete('/categories/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a category fails (from approveRejectComments_deleteCategory)', async () => {
  fetchMock.delete('/categories/1', {
    status: 500,
    body: { error: 'Unable to delete category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete category')).toBeInTheDocument();
}, 10000);

