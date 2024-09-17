import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignPostToCategory_publishBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can assign a post to a category successfully', async () => {
  fetchMock.post('/posts/1/categories', {
    status: 200,
    body: { postId: 1, categoryId: 1 }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Category')); });

  expect(fetchMock.calls('/posts/1/categories').length).toBe(1);
  expect(screen.getByText('Post assigned to category successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning a post to a category fails', async () => {
  fetchMock.post('/posts/1/categories', {
    status: 500,
    body: { error: 'Unable to assign category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Category')); });

  expect(fetchMock.calls('/posts/1/categories').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign category')).toBeInTheDocument();
}, 10000);

test('Success: publish a draft blog post', async () => {
  fetchMock.put('/api/publishPost', { status: 200, body: { id: 1, title: 'Draft Post', content: 'Some content', status: 'Published' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post published successfully')).toBeInTheDocument();
}, 10000);

test('Failure: publish a draft post without content', async () => {
  fetchMock.put('/api/publishPost', { status: 400, body: { error: 'Content cannot be empty' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be empty')).toBeInTheDocument();
}, 10000);