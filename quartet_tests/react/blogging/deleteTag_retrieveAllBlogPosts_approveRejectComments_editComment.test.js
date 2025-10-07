import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteTag_retrieveAllBlogPosts_approveRejectComments_editComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can delete a tag successfully (from deleteTag_retrieveAllBlogPosts)', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails (from deleteTag_retrieveAllBlogPosts)', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of all blog posts (from deleteTag_retrieveAllBlogPosts)', async () => {
  fetchMock.get('/api/posts', { status: 200, body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('Failure: retrieve a list of blog posts with server error (from deleteTag_retrieveAllBlogPosts)', async () => {
  fetchMock.get('/api/posts', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
}, 10000);

test('successfully approves a comment (from approveRejectComments_editComment)', async () => {
  fetchMock.put('/api/comments/approve/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Approve/i)); });

  expect(fetchMock.calls('/api/comments/approve/1').length).toBe(1);
  expect(screen.getByText(/Comment approved successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to approve a comment (from approveRejectComments_editComment)', async () => {
  fetchMock.put('/api/comments/approve/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Approve/i)); });

  expect(fetchMock.calls('/api/comments/approve/1').length).toBe(1);
  expect(screen.getByText(/Failed to approve comment/i)).toBeInTheDocument();
}, 10000);

test('successfully edits a comment (from approveRejectComments_editComment)', async () => {
  fetchMock.put('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Edit your comment/i), { target: { value: 'Updated comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit a comment (from approveRejectComments_editComment)', async () => {
  fetchMock.put('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Edit your comment/i), { target: { value: 'Updated comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to update comment/i)).toBeInTheDocument();
}, 10000);

