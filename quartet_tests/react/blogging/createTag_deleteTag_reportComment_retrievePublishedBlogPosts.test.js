import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createTag_deleteTag_reportComment_retrievePublishedBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can create a new tag successfully (from createTag_deleteTag)', async () => {
  fetchMock.post('/tags', {
    status: 201,
    body: { id: 1, name: 'New Tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'New Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Tag')); });

  expect(fetchMock.calls('/tags').length).toBe(1);
  expect(screen.getByText('Tag created successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when creating a new tag fails (from createTag_deleteTag)', async () => {
  fetchMock.post('/tags', {
    status: 500,
    body: { error: 'Unable to create tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'New Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Tag')); });

  expect(fetchMock.calls('/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to create tag')).toBeInTheDocument();
}, 10000);

test('User can delete a tag successfully (from createTag_deleteTag)', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails (from createTag_deleteTag)', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);

test('successfully reports a comment (from reportComment_retrievePublishedBlogPosts)', async () => {
  fetchMock.post('/api/comments/report/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Comment reported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to report a comment (from reportComment_retrievePublishedBlogPosts)', async () => {
  fetchMock.post('/api/comments/report/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Failed to report comment/i)).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of published blog posts (from reportComment_retrievePublishedBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=published', { status: 200, body: [{ id: 1, title: 'Published Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Published Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch published posts but none exist (from reportComment_retrievePublishedBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=published', { status: 404, body: { error: 'No published posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No published posts found')).toBeInTheDocument();
}, 10000);

