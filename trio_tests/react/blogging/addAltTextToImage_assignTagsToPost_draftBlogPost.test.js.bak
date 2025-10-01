import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAltTextToImage_assignTagsToPost_draftBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds alt text to an image', async () => {
  fetchMock.post('/api/alt-text', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/alt text updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add alt text to an image due to server error', async () => {
  fetchMock.post('/api/alt-text', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/failed to update alt text/i)).toBeInTheDocument();
}, 10000);

test('User can assign tags to a post successfully', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 200,
    body: { postId: 1, tags: [1, 2] }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Tags assigned to post successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning tags to a post fails', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 500,
    body: { error: 'Unable to assign tags' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign tags')).toBeInTheDocument();
}, 10000);

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
