import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportComment_retrievePublishedBlogPosts_createCategory_editTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('User can create a new category successfully (from createCategory_editTag)', async () => {
  fetchMock.post('/categories', {
    status: 201,
    body: { id: 1, name: 'New Category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'New Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Category')); });

  expect(fetchMock.calls('/categories').length).toBe(1);
  expect(screen.getByText('Category created successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when creating a new category fails (from createCategory_editTag)', async () => {
  fetchMock.post('/categories', {
    status: 500,
    body: { error: 'Unable to create category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'New Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Category')); });

  expect(fetchMock.calls('/categories').length).toBe(1);
  expect(screen.getByText('Error: Unable to create category')).toBeInTheDocument();
}, 10000);

test('User can edit an existing tag successfully (from createCategory_editTag)', async () => {
  fetchMock.put('/tags/1', {
    status: 200,
    body: { id: 1, name: 'Updated Tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'Updated Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag updated successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when editing a tag fails (from createCategory_editTag)', async () => {
  fetchMock.put('/tags/1', {
    status: 500,
    body: { error: 'Unable to update tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'Updated Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to update tag')).toBeInTheDocument();
}, 10000);

