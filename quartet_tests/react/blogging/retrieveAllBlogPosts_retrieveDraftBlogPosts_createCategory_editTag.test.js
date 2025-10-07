import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveAllBlogPosts_retrieveDraftBlogPosts_createCategory_editTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: retrieve a list of all blog posts (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts', { status: 200, body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('Failure: retrieve a list of blog posts with server error (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of draft blog posts (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 200, body: [{ id: 1, title: 'Draft Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch draft posts but none exist (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 404, body: { error: 'No draft posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No draft posts found')).toBeInTheDocument();
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

