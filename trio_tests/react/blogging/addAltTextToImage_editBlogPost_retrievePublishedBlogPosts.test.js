import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAltTextToImage_editBlogPost_retrievePublishedBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds alt text to an image', async () => {
  fetchMock.post('/api/alt-text', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/alt text updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add alt text to an image due to server error', async () => {
  fetchMock.post('/api/alt-text', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/failed to update alt text/i)).toBeInTheDocument();
}, 10000);

test('Success: edit an existing blog post', async () => {
  fetchMock.put('/api/editPost', { status: 200, body: { id: 1, title: 'Updated Post', content: 'Updated content' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('Success: retrieve a list of published blog posts', async () => {
  fetchMock.get('/api/posts?status=published', { status: 200, body: [{ id: 1, title: 'Published Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Published Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch published posts but none exist', async () => {
  fetchMock.get('/api/posts?status=published', { status: 404, body: { error: 'No published posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No published posts found')).toBeInTheDocument();
}, 10000);
