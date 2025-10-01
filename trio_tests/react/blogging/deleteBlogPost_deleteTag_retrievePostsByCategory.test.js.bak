import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteBlogPost_deleteTag_retrievePostsByCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('User can delete a tag successfully', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);

test('User can retrieve posts by category successfully', async () => {
  fetchMock.get('/categories/1/posts', {
    status: 200,
    body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }]
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/categories/1/posts').length).toBe(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('User gets an error message when retrieving posts by category fails', async () => {
  fetchMock.get('/categories/1/posts', {
    status: 500,
    body: { error: 'Unable to fetch posts' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/categories/1/posts').length).toBe(1);
  expect(screen.getByText('Error: Unable to fetch posts')).toBeInTheDocument();
}, 10000);
