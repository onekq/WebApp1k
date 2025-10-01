import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createBlogPost_deleteBlogPost_retrievePostAnalytics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: create a new blog post', async () => {
  fetchMock.post('/api/createPost', { status: 200, body: { id: 1, title: 'New Post', content: 'Some content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New Post')).toBeInTheDocument();
}, 10000);

test('Failure: create a new blog post with an empty title', async () => {
  fetchMock.post('/api/createPost', { status: 400, body: { error: 'Title cannot be empty' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
}, 10000);

test('Success: delete a blog post', async () => {
  fetchMock.delete('/api/deletePost', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post deleted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: delete a blog post without authorization', async () => {
  fetchMock.delete('/api/deletePost', { status: 403, body: { error: 'Unauthorized' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
}, 10000);

test('successfully retrieves analytics for a post', async () => {
  fetchMock.get('/api/getPostAnalytics?postId=1', { status: 200, body: { views: 10, shares: 5 } });

  await act(async () => { render(<MemoryRouter><RetrievePostAnalytics postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Analytics')); });

  expect(fetchMock.calls('/api/getPostAnalytics')).toHaveLength(1);
  expect(screen.getByText('Views: 10')).toBeInTheDocument();
  expect(screen.getByText('Shares: 5')).toBeInTheDocument();
}, 10000);

test('fails to retrieve analytics for a post with an error message', async () => {
  fetchMock.get('/api/getPostAnalytics?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><RetrievePostAnalytics postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Analytics')); });

  expect(fetchMock.calls('/api/getPostAnalytics')).toHaveLength(1);
  expect(screen.getByText('Error retrieving analytics')).toBeInTheDocument();
}, 10000);
