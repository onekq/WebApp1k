import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './draftBlogPost_editBlogPost_editComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: save a draft of a blog post', async () => {
  fetchMock.post('/api/saveDraft', { status: 200, body: { id: 1, title: 'Draft Post', content: 'Some content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Draft Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save draft/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft saved successfully')).toBeInTheDocument();
}, 10000);

test('Failure: save a draft of a blog post with network error', async () => {
  fetchMock.post('/api/saveDraft', { throws: new Error('Network Error') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Draft Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save draft/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('Success: edit an existing blog post', async () => {
  fetchMock.put('/api/editPost', { status: 200, body: { id: 1, title: 'Updated Post', content: 'Updated content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Updated content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/update/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post updated successfully')).toBeInTheDocument();
}, 10000);

test('Failure: edit an existing blog post without authorization', async () => {
  fetchMock.put('/api/editPost', { status: 403, body: { error: 'Unauthorized' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Updated content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/update/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
}, 10000);

test('successfully edits a comment', async () => {
  fetchMock.put('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Edit your comment/i), { target: { value: 'Updated comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit a comment', async () => {
  fetchMock.put('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Edit your comment/i), { target: { value: 'Updated comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to update comment/i)).toBeInTheDocument();
}, 10000);
